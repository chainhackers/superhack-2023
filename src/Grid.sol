// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

interface IGridTile {
    function initMove(uint32 x, uint32 y) external;
}

contract Grid {
    struct GridTileCoordinates {
        uint32 topLeftX;
        uint32 topLeftY;
    }

    mapping(uint32 => mapping(uint32 => address)) public tiles;
    mapping(address => GridTileCoordinates) public tileCoordinates;

    function registerGridTile(address subcontract, uint32 topLeftX, uint32 topLeftY) public {
        require(topLeftX % 10 == 0, "topLeftX must be a multiple of 10");
        require(topLeftY % 10 == 0, "topLeftY must be a multiple of 10");
        require(tiles[topLeftX][topLeftY] == address(0), "GridTile already registered");
        // TODO check if address is an IGridTile instance

        tiles[squareNumberX][squareNumberY] = subcontract;
    }

    function deregisterGridTile(address subcontract) public {
        require(tileCoordinates[subcontract] != address(0), "GridTile not registered");
        GridTileCoordinates coords = tileCoordinates[subcontract];
        delete tiles[coords.topLeftX][coords.topLeftY];
        delete tileCoordinates[subcontract];
    }

    function move(uint32 x, uint32 y) public {
        uint topLeftX = x - x % 10;
        uint topLeftY = y - y % 10;

        require(tiles[topLeftX][topLeftY] != address(0), "GridTile not registered");
        IGridTile(tiles[topLeftX][topLeftY]).initMove(x, y);
    }
}