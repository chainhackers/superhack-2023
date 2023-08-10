// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

interface IGrid {
    event MoveSent(uint256 id, uint8 move, uint256 gameId, address player);

    function sendMove(uint256 x, uint256 y) external;

    function getGameInfo(uint256 x, uint256 y) external returns (uint256, address);
}
