// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "../../lib/openzeppelin-contracts-upgradeable/contracts/token/ERC1155/IERC1155Upgradeable.sol";

/**
 * @title IGameRegistry
 * @notice Registering and managing games on the InfiniQuilt Grid.
 * @notice It allows for the registration of game contracts, setting up game parameters, responding to player moves, and more.
 * @notice Game backends can use this interface to integrate their games with the main grid and provide consistent gameplay experiences.
 */
interface IGameRegistry is IERC1155Upgradeable {
    // Game registration struct to store game details like grid position and address.
    struct RegisteredGameEntry {
        // address of the game contract
        address game;
        // x coordinate of the upper left cell of the game in the grid
        int256 x;
        // y coordinate of the upper left cell of the game in the grid
        int256 y;
    }

    enum MoveResult {
        Loss,
        Win,
        NoResult
    }

    // Event emitted when a new game is registered
    event GameRegistered(uint256 indexed gameId, address indexed gameContract, address indexed registrar);

    // Event emitted when a timeout request is made
    event TimeoutRequested(uint256 indexed gameId, address indexed requester);

    // Event emitted when a game setup is done
    event GameSetup(uint256 indexed gameId, uint256 movePrice, uint256 rewardBalance, uint256 timeoutSpan, bytes32 gameStateHash);

    // Event emitted when a game answers a player move
    event MoveAnswered(uint256 indexed gameId, uint256 indexed moveId, MoveResult result, uint256 rewardValue, bool isGameOver);

    /**
     * @dev Register a new game contract to the grid.
     *
     * @param gameContract Address of the game contract.
     * @param x X coordinate of the upper left cell of the game in the grid.
     * @param y Y coordinate of the upper left cell of the game in the grid.
     */
    function registerGame(address gameContract, int256 x, int256 y) external;

    /**
     * @dev Register a timeout request due to a game not processing moves in time.
     *
     * @param gameId Unique identifier for the game.
     */
    function requestTimeout(uint256 gameId) external;

    /**
     * @dev Setup a game with required parameters.
     *
     * @param gameId Unique identifier for the game.
     * @param movePrice Price for each move in the game.
     * @param rewardBalance Reward balance for the game.
     * @param timeoutSpan Duration within which game must answer player moves.
     * @param gameStateHash Hash of the game's initial state.
     */
    function setupGame(uint256 gameId, uint256 movePrice, uint256 rewardBalance, uint256 timeoutSpan, bytes32 gameStateHash) external payable;

    /**
     * @dev Answer a player's move.
     *
     * @param gameId Unique identifier for the game.
     * @param moveId ID of the move made by the player.
     * @param result Result of the move (Loss, Win, or No Result).
     * @param rewardValue Reward to be given to the player.
     * @param isGameOver Boolean indicating if the game is over.
     */
    function answerPlayerMove(uint256 gameId, uint256 moveId, MoveResult result, uint256 rewardValue, bool isGameOver) external;
}
