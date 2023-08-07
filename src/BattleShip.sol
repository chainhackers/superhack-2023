// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "./interfaces/IGame.sol";

contract BattleShip is IGame {
    uint256 public number;

    function isValidMove(uint8 move, uint256 gameId) external view returns (bool){
        return move % 5 > 0;
    }

    function move(uint8 move, uint256 gameId) external {
        emit Move(number, move, 1, msg.sender);
        number++;
    }

    function moveResult(uint256 moveId, uint256 gameId, uint8 result) external {
        emit MoveResult(moveId, 1, result);
    }

    function name(uint256 gameId) external view returns (string memory){
        return "BattleShip";
    }

    function image(uint256 gameId) external view returns (string memory){
        return "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Battleship_game_board.svg/1200px-Battleship_game_board.svg.png";
    }
}
