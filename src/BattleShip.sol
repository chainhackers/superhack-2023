// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "./interfaces/IGame.sol";

contract BattleShip is IGame {
    uint256 public number;

    function isValidMove(uint8 coordinate, uint256 gameId) external view returns (bool){
        return coordinate % 5 > 0;
    }

    function move(uint8 coordinate, uint256 gameId) external {
        emit Move(number, coordinate, gameId, msg.sender);
        number++;
    }

    function moveResult(uint256 moveId, uint8 result, uint256 gameId) external {
        emit MoveResult(moveId, result, gameId);
    }
}
