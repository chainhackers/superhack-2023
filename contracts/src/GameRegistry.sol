// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./interfaces/IGameRegistry.sol";

contract GameRegistry is IGameRegistry {
    // Mapping of game address to game IDs
    mapping(address => uint256) public gameIds;
    // Mapping of game IDs to game address
    mapping(uint256 => address) public games;

    uint256 public nextGameId = 1;

    function registerGame(address game) external override {
        uint256 gameId = nextGameId++;
        gameIds[game] = gameId;
        games[gameId] = game;
        emit GameRegistered(gameIds[game], game, msg.sender);
    }

    function requestTimeout(uint256 gameId) external override {
        emit TimeoutRequested(gameId, msg.sender);
    }

    function setupGame(uint256 gameId, uint256 movePrice, uint256 rewardBalance, uint256 timeoutSpan, bytes32 gameStateHash) external payable {
        emit GameSetup(gameId, movePrice, rewardBalance, timeoutSpan, gameStateHash);
    }

    function answerPlayerMove(uint256 gameId, uint256 moveId, MoveResult result, uint256 rewardValue, bool isGameOver) external {
        emit MoveAnswered(gameId, moveId, result, rewardValue, isGameOver);
    }

    function isGame(address game) external view returns (bool) {
        return gameIds[game] > 0;
    }
}
