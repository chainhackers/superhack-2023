from abc import ABC, abstractmethod


class Game(ABC):
    @abstractmethod
    def board_size(self, size=10):
        """
        Size of board for one game. Default 10.
        :param size: int
        :return: None
        """
        ...

    @abstractmethod
    def player_move(self, value):
        """
        Define an abstract method that will process and respond to player move transactions.
        The method should be capable of sending a response which can be: Loss, Win, or No Result.
        Additionally, the method should handle Reward Value calculations and determine if the game is concluded.
        :param value:
        :return: str [Loss, Win]
        """
        ...

    @abstractmethod
    def subscribe_to_contract_events(self):
        """
        Implement a method to subscribe to events from the InfiniQuilt Grid.
        Ensure the subscription filters events specifically for the 10x10 grid square serviced by the backend.
        :return: str
        """
        ...

    @property
    def game_settings(self):
        """
        Define a class or method that can be used to configure and fetch global settings.
        These settings should include the Game Contract Address which serves as the game ID.
        """
        return self.game_settings

    @game_settings.setter
    def game_settings(self, contract):
        """

        :param contract:
        :return: None
        """
        ...

    @property
    def settings_from_contract(self):
        return self.settings_from_contract

    @settings_from_contract.setter
    def settings_from_contract(self, contract_address):
        """
        Grid coordinates.
        Current game state.
        Any other essential game parameters or configurations.
        :param contract_address: str
        :return: dict
        """
        ...
