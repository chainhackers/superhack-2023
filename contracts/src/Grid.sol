// SPDX-License-Identifier: MIT
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

    function cellDetails(int256 x, int256 y) external view returns (address game, uint8 coordinate, uint256 tokenType, uint256 tokenId, string memory url){
        game = 0x1B8E12F839BD4e73A47adDF76cF7F0097d74c14C;
        coordinate = uint8(uint256((y * 10 + x) % 100));
        tokenType = 1;
        tokenId = coordinate;
        url = "https://arweave.net/rip5RY1wf8gKBl5CxEAKQHG9tc09SqyMFwJDOYT8xX0/{id}";
    }
}
