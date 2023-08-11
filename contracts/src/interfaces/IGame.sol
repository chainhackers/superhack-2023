// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {ZoKratesStructs} from "../lib/ZoKratesStructs.sol";

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
    // Event emitted when a new game is initialized
    event GameInit(uint256 indexed gameId, bytes32 digest);
    // Event emitted when a player makes a move
    event Move(uint256 id, uint8 coordinate, uint256 indexed gameId, address indexed player);
    // Event emitted when a game answers a player move
    event MoveResult(uint256 id, uint8 result, uint256 indexed gameId);



    /**
        @notice Game backends must call this function before a game can be played,
        @notice and publish the game's secret state digest. The digest is used to prove that game backends
        @notice stick with game states they committed to.
        @dev Must store the digest in the game contract.
        @dev Must emit a GameInit event.
        @dev Must revert if the game is already initialized and not over.
        @dev We intentionally keep the digest in the game contract instead of the registry
        @dev and make it a convention for game contracts instead. Some of the games may not use a secret state at all.
        @param gameId Unique identifier for the game.
        @param digest Digest of the game secret state.
    */
    function initGame(uint256 gameId, bytes32 digest) external;

    /**
        @notice Check if a move is valid.
        @notice This function is called by the grid contract or by the game client.
        @param coordinate Coordinate of the move.
        @param gameId Unique identifier for the game.
        @return True if the move is valid, false otherwise.
    */
    function isValidMove(uint8 coordinate, uint256 gameId) external view returns (bool);

    /**
        @notice Register a player's move in the game contract and emit a Move event
        @notice to notify the backend service so it can answer the move.
        @dev This function is called by the grid contract.
        @dev Must emit a Move event.
        @dev Must keep the move till its result is answered, the move must be accessible by its ID.
        @dev Must revert if the move is invalid.
        @dev Must revert if the game is over or not initialized.
        @dev There's no digest parameter because the digest is kept in the game contract.
        @param coordinate Coordinate of the move.
        @param gameId Unique identifier for the game.
    */
    function move(uint8 coordinate, uint256 gameId) external;

    /**
        @notice Answer a player's move.
        @notice This function is called by game backend services.
        @param moveId Unique identifier for the move.
        @param result Result of the move.
        @param gameId Unique identifier for the game.
        @param inputs Inputs for the ZoKrates proof.
        @param proof Proof for the move result.
    */
    function moveResult(uint256 moveId, uint8 result, uint256 gameId, uint256[] calldata inputs, ZoKratesStructs.Proof calldata proof) external;

    /**
        @notice Get the name of the game.
        @param gameId Unique identifier for the game.
        @return Name of the game.
    */
    function name(uint256 gameId) external view returns (string memory);

    /**
        @notice Get the image of the game.
        @param gameId Unique identifier for the game.
        @return URL of the game image.
    */
    function image(uint256 gameId) external view returns (string memory);
}
