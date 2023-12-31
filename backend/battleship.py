#!/usr/bin/env python3
import argparse
import os
import random

from web3 import Web3

from constants import ABI
from utils import parse_proof
from zokrates import zokrates_prove
from game import Game
from log_setup import setup_logger

logger = setup_logger()

HORIZONTAL = 1
VERTICAL = 0
PRIVATE_KEY = os.environ['PRIVATE_KEY']


class BattleshipGame(Game):
    board = 0

    def __init__(
            self,
            rpc_url,
            game_id,
            contract_address,
            zokrates_executable_location,
            zokrates_init_handler_dir,
            zokrates_move_handler_dir,
    ):
        self._rpc_url = rpc_url
        self._contract_address = contract_address
        self._zokrates_executable_location = zokrates_executable_location
        self._zokrates_init_handler_dir = zokrates_init_handler_dir
        self._zokrates_move_handler_dir = zokrates_move_handler_dir
        self.board_size()
        self._game_id = int(game_id)
        self.calculate_filled_cells()

    @property
    def contract(self):
        """
        Returns contract instance.
        :return: contract instance
        """
        if not hasattr(self, '_contract'):
            checksum_address = Web3.to_checksum_address(self._contract_address)
            self._contract = self.w3.eth.contract(
                address=checksum_address,
                abi=ABI)
        return self._contract

    @property
    def account(self):
        if not hasattr(self, '_account'):
            self._account = self.w3.eth.account.from_key(f'{PRIVATE_KEY}')
        return self._account

    @property
    def w3(self):
        if not hasattr(self, '_w3'):
            self._w3 = Web3(Web3.HTTPProvider(self._rpc_url))
        return self._w3

    def board_size(self, size=10):
        self.board = [[0] * 10 for _ in range(size)]

    def calculate_filled_cells(self):
        """
        Fill board with "ships".
        """
        self.ships_positions = []

        for ship_size in [5, 4, 3, 3, 2]:
            while True:
                direction = random.choice([HORIZONTAL, VERTICAL])
                if direction == HORIZONTAL:
                    row = random.randint(0, 9)
                    col = random.randint(0, 10 - ship_size)  # Ship size
                else:
                    row = random.randint(0, 10 - ship_size)  # Ship size
                    col = random.randint(0, 9)

                # Check
                if all(self.board[row + (direction == VERTICAL) * i][col + (direction == HORIZONTAL) * i] == 0 for i in
                       range(ship_size)):
                    # Place ship and change cells
                    for i in range(ship_size):
                        self.board[row + (direction == VERTICAL) * i][col + (direction == HORIZONTAL) * i] = 1
                    if direction == HORIZONTAL:
                        self.ships_positions.extend([row, col, HORIZONTAL])
                    else:
                        self.ships_positions.extend([row, col, VERTICAL])
                    break
        self.call_game_init(self._zokrates_init_validator())

    def _zokrates_init_validator(self):
        """
        Backend call's to init function of zokrates.
        :return: zokrates proof.json file
        """
        return zokrates_prove(
            self._zokrates_executable_location,
            self._zokrates_init_handler_dir,
            *self.ships_positions,
            logger=logger,
        )

    def call_game_init(self, proof):
        """
        Calls to contract function gameInit with params:
        :param proof:
        :return:
        """
        try:
            tx = self.contract.functions.initGame(
                int(self._game_id),
                *parse_proof(proof),
            ).build_transaction({
                "from": self.account.address,
                "nonce": self.w3.eth.get_transaction_count(self.account.address),
            })
            signed_tx = self.w3.eth.account.sign_transaction(tx, private_key=PRIVATE_KEY)
            tx_hash = self.w3.eth.send_raw_transaction(signed_tx.rawTransaction)
            logger.info(f"TX SENT {tx_hash.hex()} FROM GAME_INIT")
        except Exception as e:
            logger.error(f"TX FAILED {e}")

    def _zokrates_move_validator(self, coordinate, digest):
        """
        Calls to zokrates proover with listed params.
        Returns proof for current players move.
        :param coordinate:
        :param digest:
        :return:
        """
        return zokrates_prove(
            self._zokrates_executable_location,
            self._zokrates_move_handler_dir,
            *self.ships_positions,
            digest,
            coordinate,
            logger=logger,
        )

    def calculate_result(self, guess):
        """
        Find users move result using game logic.
        :param guess: int
        :return: tuple
        """
        if 0 <= guess <= 99:
            guess_row = guess // 10
            guess_col = guess % 10

            if self.board[guess_row][guess_col] == 1:  # Player won
                logger.info(f'User hit the cell with reward. Coord: {guess}')
                self.board[guess_row][guess_col] = 'X'
                if all(cell == '-' for row in self.board for cell in row):
                    logger.warn('Game should be reset as no cells')
                return 1, "Win"
            else:  # Player lose
                logger.info(f'User hit empty cell. Coord: {guess}')
                self.board[guess_row][guess_col] = '-'
                if all(cell == '-' for row in self.board for cell in row):
                    logger.warn('Game should be reset as no cells')
                return 2, "Loss"

    def call_move_result(self, move_id, game_id, result, proof):
        """
        Calls to contract function moveResult with params:
        :param move_id: int
        :param game_id: int
        :param result: int
        :return:
        """
        try:
            logger.info(f'Sending transaction with result {result[1]} to contract')
            tx = self.contract.functions.moveResult(
                move_id,
                result[0],  # Status code
                game_id,
                *parse_proof(proof)
            ).build_transaction({
                "from": self.account.address,
                "nonce": self.w3.eth.get_transaction_count(self.account.address),
            })
            signed_tx = self.w3.eth.account.sign_transaction(tx, private_key=PRIVATE_KEY)
            tx_hash = self.w3.eth.send_raw_transaction(signed_tx.rawTransaction)
            logger.info(f"tx sent {tx_hash.hex()} from move_result")
            logger.info(f'transaction details'
                        f'{self.w3.eth.wait_for_transaction_receipt(tx_hash)}')
        except Exception as e:
            logger.error(f"TX FAILED {e}")

    def player_move(self, value):
        """
        Call the contract's moveResult function after receiving players move.
        """
        arguments = {
            'move_id': value['id'],
            'game_id': value['gameId'],
            'result': self.calculate_result(guess=value['coordinate']),
            'proof': self._zokrates_move_validator(
                digest=value['digest'],
                coordinate=value['coordinate']
            )
        }
        self.call_move_result(**arguments)

    def handle_move_event(self, event):
        msg = {
            "id": event['args']['id'],
            "coordinate": event['args']['coordinate'],
            "gameId": event['args']['gameId'],
            "player": event['args']['player'],
            "digest": event['args']['digest']
        }
        logger.info(f'Event received: {msg}')
        if self._game_id == msg['gameId']:
            logger.info("Call player_move function")
            self.player_move(msg)
            logger.info(msg)
        else:
            logger.info(f'Wrong game id {msg["gameId"]} != {self._game_id}')

    def subscribe_to_contract_events(self):
        """
        Contract event listener.
        Listen to event 'Player's Move' -> send it to game logic via handler.
        """

        event_move = "Move"
        last_block_number = self.w3.eth.block_number
        event_move_filter = self.contract.events[event_move].create_filter(
            fromBlock=last_block_number + 1)
        while True:
            for event in event_move_filter.get_new_entries():
                self.handle_move_event(event)

    @property
    def game_settings(self):
        return self.game_settings

    @game_settings.setter
    def game_settings(self, contract):
        self.game_settings = contract

    @property
    def settings_from_contract(self):
        return self.settings_from_contract

    @settings_from_contract.setter
    def settings_from_contract(self, contract_address):
        # Fetch and store settings from contract
        pass


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Event Listener for Ethereum Smart Contract")
    parser.add_argument("--rpc_url", required=True, help="RPC URL of Ethereum node")
    parser.add_argument("--contract_address", required=True, help="Address of the smart contract")
    parser.add_argument("--game_id", required=True, help="Game identificator of registered game.")
    parser.add_argument("--zokrates_executable_location", required=True, help="Path to zokrates binary")
    parser.add_argument("--zokrates_init_handler_dir", required=True,
                        help="Path of the directory of game init proover code and configuration files")
    parser.add_argument("--zokrates_move_handler_dir", required=True,
                        help="Path of the directory of game move proover code and configuration files")
    args = parser.parse_args()

    game = BattleshipGame(
        rpc_url=args.rpc_url,
        game_id=args.game_id,
        contract_address=args.contract_address,
        zokrates_executable_location=args.zokrates_executable_location,
        zokrates_init_handler_dir=args.zokrates_init_handler_dir,
        zokrates_move_handler_dir=args.zokrates_move_handler_dir
    )
    game.subscribe_to_contract_events()
