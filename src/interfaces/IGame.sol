// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

/**
    @title IGame
    @notice Interface for games on the InfiniQuilt Grid.
    @notice It is used by the grid and by game backend microservices
    @notice to interact with game contracts.
    @notice The grid translates infinite coordinates to game coordinates
    @notice and calls the game contract's move function.
    @notice The game backend microservices call the game contract's moveResult function
    @notice to answer users' actions update the game state.
*/
interface IGame {
    // Event emitted when a player makes a move
    event Move(uint256 id, uint8 coordinate, uint256 indexed gameId, address indexed player);
    // Event emitted when a game answers a player move
    event MoveResult(uint256 id, uint8 result, uint256 indexed gameId);

    /**
        @dev Check if a move is valid.
        @dev This function is called by the grid contract or by the game client.
        @param coordinate Coordinate of the move.
        @param gameId Unique identifier for the game.
        @return True if the move is valid, false otherwise.
    */
    function isValidMove(uint8 coordinate, uint256 gameId) external view returns (bool);

    /**
        @dev Execute a player's move.
        @dev This function is called by the grid contract.
        @param coordinate Coordinate of the move.
        @param gameId Unique identifier for the game.
    */
    function move(uint8 coordinate, uint256 gameId) external;

    /**
        @dev Answer a player's move.
        @dev This function is called by game backend microservices.
        @param moveId Unique identifier for the move.
        @param result Result of the move.
        @param gameId Unique identifier for the game.
    */
    function moveResult(uint256 moveId, uint8 result, uint256 gameId) external;

    function name(uint256 gameId) external view returns (string memory);

    function image(uint256 gameId) external view returns (string memory);
}
