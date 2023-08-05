// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "./interfaces/IGame.sol";

contract BattleShip is IGame {
    uint256 public number;

    function isValidMove(uint8 move) external view returns (bool){
        return move % 5 > 0;
    }

    function move(uint8 move) external {
        emit Move(number, move, 1, msg.sender);
        number++;
    }

    function moveResult(uint256 moveId, uint8 result) external {
        emit MoveResult(moveId, result);
    }
}
