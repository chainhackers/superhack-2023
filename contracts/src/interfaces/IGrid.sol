// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IGrid {
    //  Move struct to store moves until they are answered by the game contract.
    struct Move {
        uint8 move;
        uint256 gameId;
        address player;
    }

    // emitted when a move is sent to a game contract by the grid contract
    event MoveSent(uint256 id, uint8 move, uint256 gameId, address player);

    /**
     * @notice The grid contract will call the game contract's move function
     * @notice when a player makes a move on the grid.
     *
     * @param x X coordinate of the game on the grid.
     * @param y Y coordinate of the game on the grid.
     */
    function sendMove(int256 x, int256 y) external;

    /**
     * @notice Get game details by its coordinates on the grid.
     * @notice World coordinates are converted to game coordinates.
     * @dev x and y are transformed to game ID with Cantor pairing function for two signed ints
     * @return gameId Unique identifier for the game.
     * @return game Address of the game contract.
     */
    function getGameInfo(int256 x, int256 y) external view returns (uint256 gameId, address game);

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
