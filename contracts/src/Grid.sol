// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./interfaces/IGrid.sol";

contract Grid is IGrid {

    uint256 public nextMoveId;
    uint256 public x;
    uint256 public y;
    address public player;

    function sendMove(uint256 _x, uint256 _y) external {
        x = _x;
        y = _y;
        uint8 move = 1;
        uint256 gameId = 1;
        emit MoveSent(nextMoveId, move, gameId, msg.sender);
        nextMoveId++;
    }

    function getGameInfo(uint256 _x, uint256 _y) external returns (uint256, address) {
        return (1, 0x1B8E12F839BD4e73A47adDF76cF7F0097d74c14C);
    }

}
