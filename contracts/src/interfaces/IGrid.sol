// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IGrid {
    event MoveSent(uint256 id, uint8 move, uint256 gameId, address player);

    function sendMove(uint256 x, uint256 y) external;

    function getGameInfo(uint256 x, uint256 y) external returns (uint256, address);

    /**
     * @notice Details of the cell at the given coordinates.
     * @notice World coordinates are converted to game coordinates,
     * @notice location the game cell represented as an ERC-1155 token is returned.
     * @notice Additionally, token image URL is proxied from the game contract,
     * @notice as it is mot often the only detail needed to display the cell.
     *
     * @param x X coordinate of the cell.
     * @param y Y coordinate of the cell.
     * @return game Address of the game contract.
     * @return coordinate Coordinate of the cell in the game.
     * @return tokenType Type of the token representing the cell.
     * @return tokenId Id of the token representing the cell.
     * @return image URL of the image representing the cell.
     */
    function cellDetails(int256 x, int256 y) external view returns (address game, uint8 coordinate, uint256 tokenType, uint256 tokenId, string memory image);
}
