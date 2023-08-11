import argparse
import random
import json

from web3 import Web3

from constants import ABI, PATH_TO_ZOKRATES, PATH_TO_PROOF
from utils import parse_proof
from zokrates import zokrates_init, zokrates_move_validator
from game import Game
from log_setup import setup_logger

logger = setup_logger()

HORIZONTAL = 1
VERTICAL = 0

class BattleshipGame(Game):
    board = 0

    def __init__(self, rpc_url, contract_address, zokrates_executable_location):
        self._rpc_url = rpc_url
        self._contract_address = contract_address
        self._zokrates_executable_location = zokrates_executable_location
        self._zokrates_work_dir = PATH_TO_ZOKRATES
        self.board_size()
        self.calculate_filled_cells()

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
                if all(self.board[row + (direction == VERTICAL) * i][col + (direction == HORIZONTAL) * i] == 0 for i in range(ship_size)):
                    # Place ship and change cells
                    for i in range(ship_size):
                        self.board[row + (direction == VERTICAL) * i][col + (direction == HORIZONTAL) * i] = 1
                    if direction == HORIZONTAL:
                        self.ships_positions.extend([row, col, HORIZONTAL])
                    else:
                        self.ships_positions.extend([row, col, VERTICAL]) 
                    break
        zokrates_init(self._zokrates_executable_location, self.ships_positions) 

    def game_move_price(self, quantity):
        self.game_move_price = quantity

    def calculate_result(self, guess):
        """
        Find users move result
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

    def call_move_result(self, move_id, game_id, result):
        """
        Calls to contract function moveResult with params:
        :param move_id: int
        :param game_id: int
        :param result: int
        :return:
        """
        with open(f"{PATH_TO_PROOF}/proof.json", "r") as f:
            self.proof = json.load(f)
        transaction_hash = self.contract.functions.moveResult(
            self.w3.to_wei(move_id, "wei"),  # Convert to type uint256
            self.w3.to_wei(game_id, "wei"),  # Convert to type uint256
            result[0],  # Status code
            *parse_proof(self.proof)
        ).transact()
        logger.info(f'SEND TRANSACTION WITH RESULT {result[1]} TO CONTRACT')
        logger.info(f'TRANSACTION DETAILS'
                    f'{self.w3.eth.wait_for_transaction_receipt(transaction_hash)}')

    def player_move(self, value):
        """
        Call the contract's moveResult function after receiving players move.
        """
        arguments = {
            'move_id': value['id'],
            'game_id': value['gameId'],
            'result': self.calculate_result(guess=value['coordinate']),
            'proof': zokrates_move_validator(self._zokrates_executable_location, self.ships_positions, value['hash'], value['coordinate']) # TODO Change attribute in get method to real hash
        }
        self.call_move_result(**arguments)

    def handle_event(self, event):
        msg = {"id": event['args']['id'],
               "coordinate": event['args']['coordinate'],
               "gameId": event['args']['gameId'],
               "player": event['args']['player'],
               }
        print(msg)
        self.player_move(msg)
        logger.info(msg)

    def subscribe_to_contract_events(self):
        """
        Contract event listener.

        """
        checksum_address = Web3.to_checksum_address(self._contract_address)
        self.w3 = Web3(Web3.HTTPProvider(self._rpc_url))
        self.contract = self.w3.eth.contract(
            address=checksum_address,
            abi=ABI)
        event_move = "Move"
        event_init = "Initialize"
        last_block_number = self.w3.eth.block_number
        event_move_filter = self.contract.events[event_move].create_filter(
            fromBlock=last_block_number + 1)
        event_init_filter = self.contract.events[event_init].create_filter(
            fromBlock=last_block_number + 1)
        while True:
            for event in event_move_filter.get_new_entries():
                self.handle_move_event(event)
            for event in event_init_filter.get_new_entries():
                self.game_init_event_handler(event) 

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
    parser.add_argument("--zokrates_executable_location", required=True, help="Path to zokrates binary")
    # parser.add_argument("--zokrates_work_dir", required=True, help="Path of the directory contains proover code and configuration files")
    args = parser.parse_args()

    game = BattleshipGame(args.rpc_url, args.contract_address, args.zokrates_executable_location) #, args.zokrates_work_dir)
    game.subscribe_to_contract_events()
