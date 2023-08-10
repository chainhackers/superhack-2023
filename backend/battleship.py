import argparse
import random

from web3 import Web3

from constants import ABI
from game import Game
from log_setup import setup_logger

logger = setup_logger()


class BattleshipGame(Game):
    board = 0

    def __init__(self, rpc_url, contract_address):
        self._rpc_url = rpc_url
        self._contract_address = contract_address
        self.board_size()
        self.calculate_filled_cells()

    def board_size(self, size=10):
        self.board = [[0] * 10 for _ in range(size)]

    def calculate_filled_cells(self):
        """
        Fill board with "ships".
        """
        for ship_size in [5, 4, 3, 3, 2]:
            while True:
                direction = random.choice(['horizontal', 'vertical'])
                if direction == 'horizontal':
                    row = random.randint(0, 9)
                    col = random.randint(0, 10 - ship_size)  # Ship size
                else:
                    row = random.randint(0, 10 - ship_size)  # Ship size
                    col = random.randint(0, 9)

                # Check
                if all(self.board[row + (direction == 'vertical') * i][col + (direction == 'horizontal') * i] == 0 for i in range(ship_size)):
                    # Place ship and change cells
                    for i in range(ship_size):
                        self.board[row + (direction == 'vertical') * i][col + (direction == 'horizontal') * i] = 1
                    break

    @property
    def timeout(self):
        return self.timeout

    @timeout.setter
    def timeout(self, num_in_sec):
        self.timeout = num_in_sec

    def game_move_price(self, quantity):
        self.game_move_price = quantity

    @property
    def reward_balance(self):
        return self.reward_balance

    @reward_balance.setter
    def reward_balance(self, value):
        self.reward_balance = value

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
        transaction_hash = self.contract.functions.moveResult(
            self.w3.to_wei(move_id, "wei"),  # Convert to type uint256
            self.w3.to_wei(game_id, "wei"),  # Convert to type uint256
            result[0]  # Status code
        ).transact()
        logger.info(f'SEND TRANSACTION WITH RESULT {result[1]} TO CONTRACT'
                    f'{self.w3.eth.wait_for_transaction_receipt(transaction_hash)}'
                    )

    def player_move(self, value):
        """
        Call the contract's moveResult function after receiving players move.
        """
        arguments = {
            'move_id': value['id'],
            'game_id': value['gameId'],
            'result': self.calculate_result(guess=value['move'])
        }
        self.call_move_result(**arguments)

    def handle_event(self, event):
        msg = {"id": event['args']['id'],
               "move": event['args']['move'],
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
        event_name = "Move"
        last_block_number = self.w3.eth.block_number
        event_filter = self.contract.events[event_name].create_filter(
            fromBlock=last_block_number + 1)
        while True:
            for event in event_filter.get_new_entries():
                self.handle_event(event)

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
    args = parser.parse_args()

    game = BattleshipGame(args.rpc_url, args.contract_address)
    game.subscribe_to_contract_events()
