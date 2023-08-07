// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

interface IGame {
    event Move(uint256 id, uint8 move, uint256 gameId, address player);
    event MoveResult(uint256 id, uint256 gameId, uint8 result);

    function isValidMove(uint8 move, uint256 gameId) external view returns (bool);

    function move(uint8 move, uint256 gameId) external;

    function moveResult(uint256 moveId, uint256 gameId, uint8 result) external;

    function name(uint256 gameId) external view returns (string);

    function image(uint256 gameId) external view returns (string);
}
