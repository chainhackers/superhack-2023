// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "./interfaces/IGame.sol";
import "./interfaces/IGameRegistry.sol";
import "../lib/openzeppelin-contracts/contracts/access/Ownable.sol";
import "./verifiers/battleship_init.sol";
import "./verifiers/battleship_move.sol";

contract BattleShip is IGame, Ownable {
    uint256 public number;
    mapping(uint256 => uint256) public digest;
    IGameRegistry public registry;
    BattleShipInitVerifier public initVerifier;
    BattleShipMoveVerifier public moveVerifier;
    mapping(uint256 => mapping(uint8 => uint8)) public discovered;

    constructor(
        IGameRegistry _registry,
        address backend,
        BattleShipInitVerifier _initVerifier,
        BattleShipMoveVerifier _moveVerifier
    ){
        registry = _registry;
        initVerifier = _initVerifier;
        moveVerifier = _moveVerifier;
        transferOwnership(backend);
    }

    function initGame(uint256 gameId, ZoKratesStructs.Proof calldata proof, uint256[] calldata inputs) external {
        uint256[1] memory _inputs;
        _inputs[0] = inputs[0];
        BattleShipInitVerifier.Proof memory _proof;
        _proof.a.X = proof.a.X;
        _proof.a.Y = proof.a.Y;
        _proof.b.X[0] = proof.b.X[0];
        _proof.b.X[1] = proof.b.X[1];
        _proof.b.Y[0] = proof.b.Y[0];
        _proof.b.Y[1] = proof.b.Y[1];
        _proof.c.X = proof.c.X;
        _proof.c.Y = proof.c.Y;
        require(initVerifier.verifyTx(_proof, _inputs), "Invalid proof");
        digest[gameId] = inputs[0];
        for (uint8 i = 0; i < 100; i++) {
            discovered[gameId][i] = 0;
        }
        emit GameInit(gameId, digest[gameId]);
    }

    function isValidMove(uint8 coordinate, uint256 gameId) external view returns (bool){
        if (coordinate > 99) {
            return false;
        }
        return discovered[gameId][coordinate] == 0;
    }

    function move(uint8 coordinate, uint256 gameId) external {
        emit Move(number, coordinate, gameId, msg.sender, digest[gameId]);
        discovered[gameId][coordinate] = 1;
        number++;
    }

    function moveResult(uint256 moveId, uint8 result, uint256 gameId, ZoKratesStructs.Proof calldata proof, uint256[] calldata inputs) external {
        uint256[3] memory _inputs;
        _inputs[0] = moveId;
        _inputs[1] = result;
        _inputs[2] = gameId;
        BattleShipMoveVerifier.Proof memory _proof;
        _proof.a.X = proof.a.X;
        _proof.a.Y = proof.a.Y;
        _proof.b.X[0] = proof.b.X[0];
        _proof.b.X[1] = proof.b.X[1];
        _proof.b.Y[0] = proof.b.Y[0];
        _proof.b.Y[1] = proof.b.Y[1];
        _proof.c.X = proof.c.X;
        _proof.c.Y = proof.c.Y;
        require(moveVerifier.verifyTx(_proof, _inputs), "Invalid proof");
        require(digest[gameId] == inputs[0], "Invalid digest");
        emit MoveResult(moveId, result, gameId);
    }

    function name(uint256 gameId) external view returns (string memory){
        return "BattleShip";
    }

    function image(uint256 gameId) external view returns (string memory){
        return "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Battleship_game_board.svg/1200px-Battleship_game_board.svg.png";
    }
}
