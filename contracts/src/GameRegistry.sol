// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./interfaces/IGameRegistry.sol";
import "./interfaces/IGrid.sol";

import "./lib/Utils.sol";

import "../lib/openzeppelin-contracts-upgradeable/contracts/access/OwnableUpgradeable.sol";
import "../lib/openzeppelin-contracts-upgradeable/contracts/proxy/utils/UUPSUpgradeable.sol";
import "../lib/openzeppelin-contracts-upgradeable/contracts/token/ERC1155/ERC1155Upgradeable.sol";

contract GameRegistry is IGameRegistry, IGrid, UUPSUpgradeable, OwnableUpgradeable, ERC1155Upgradeable {
    // @dev incrementing ID for moves
    uint256 public nextMoveId;

    // @dev mapping of move IDs to moves
    mapping(uint256 => Move) public moves;

    // @dev mapping of game IDs to game entries
    mapping(uint256 => RegisteredGameEntry) public gameEntries;

    // @dev initializer function for upgradeable contracts
    function initialize(string calldata _uri) public initializer {
        __UUPSUpgradeable_init();
        __Ownable_init();
        __ERC1155_init(_uri);
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}

    function registerGame(address game, int256 x, int256 y) external override {
        uint256 gameId = Utils.pair(x, y);
        gameEntries[gameId] = RegisteredGameEntry(game, x, y);
        emit GameRegistered(gameId, game, msg.sender);
    }

    function requestTimeout(uint256 gameId) external override {
        emit TimeoutRequested(gameId, msg.sender);
    }

    // @notice Called by the game contract to setup a game
    // @dev must check the call is from the registered game contract
    function setupGame(uint256 gameId, uint256 movePrice, uint256 rewardBalance, uint256 timeoutSpan, bytes32 gameStateHash) external payable {
        emit GameSetup(gameId, movePrice, rewardBalance, timeoutSpan, gameStateHash);
    }

    // @notice Called by the game contract to answer a player move
    // @dev must check the call is from the registered game contract
    // @param gameId Unique identifier for the game.
    // @param moveId Unique identifier for the move.
    // @param result Result of the move produced by the game contract, may be produced asynchronously by its backend.
    // @param rewardValue Value of the reward for the move paid to the player by the game contract.
    // @param isGameOver True if the game is over, false otherwise.
    function answerPlayerMove(uint256 gameId, uint256 moveId, MoveResult result, uint256 rewardValue, bool isGameOver) external {
        emit MoveAnswered(gameId, moveId, result, rewardValue, isGameOver);
    }

    // @notice Send a move to a game contract
    // @dev x and y are world coordinates, they must be converted to game coordinates
    // @dev after the game id is found within the gameEntries mapping
    // @dev using Cantor pairing function for two signed integers
    // @param x X coordinate of the game on the grid.
    // @param y Y coordinate of the game on the grid.
    function sendMove(int256 x, int256 y) external {
        uint8 move = uint8(uint256((y * 10 + x) % 100));
        uint256 gameId = 1;
        emit MoveSent(nextMoveId, move, gameId, msg.sender);
        nextMoveId++;
    }

    function getGameInfo(int256 x, int256 y) external returns (uint256, address) {
        return (1, 0x1B8E12F839BD4e73A47adDF76cF7F0097d74c14C);
    }

    function cellDetails(int256 x, int256 y) external view returns (address game, uint8 coordinate, uint256 tokenType, uint256 tokenId, string memory url){
        game = 0x1B8E12F839BD4e73A47adDF76cF7F0097d74c14C;
        coordinate = uint8(uint256((y * 10 + x) % 100));
        tokenType = 1;
        tokenId = coordinate;
        url = "https://arweave.net/rip5RY1wf8gKBl5CxEAKQHG9tc09SqyMFwJDOYT8xX0/{id}";
    }
}
