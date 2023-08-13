// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {Test, console2} from "forge-std/Test.sol";
import {IGame} from "../src/interfaces/IGame.sol";
import {IGameRegistry} from "../src/interfaces/IGameRegistry.sol";
import {GameRegistry} from "../src/GameRegistry.sol";
import {BattleShip} from "../src/BattleShip.sol";
import {ZoKratesStructs} from "../src/lib/ZoKratesStructs.sol";
import {BattleShipInitVerifier} from "../src/verifiers/battleship_init.sol";
import {BattleShipMoveVerifier} from "../src/verifiers/battleship_move.sol";

contract BattleShipTest is Test {
    address constant BACKEND = 0xb95A131ABF8c82aC9A3e9715Fb2eb1f7E2AAfcE8;

    BattleShip public battleShip;
    IGameRegistry public gameRegistry;
    BattleShipInitVerifier public initVerifier;
    BattleShipMoveVerifier public moveVerifier;

    function setUp() public {
        initVerifier = new BattleShipInitVerifier();
        moveVerifier = new BattleShipMoveVerifier();
        gameRegistry = new GameRegistry();
        battleShip = new BattleShip(gameRegistry, BACKEND, initVerifier, moveVerifier);
    }

    function testIsValidMove(uint8 x, uint256 gameId) public {
        assertTrue(battleShip.isValidMove(1, gameId));
    }

    function testMove(uint8 x, uint256 gameId) public {
        battleShip.move(x, gameId);
        assertEq(battleShip.nextMoveId(), 1);
    }

    function testMoveTwice(uint8 x, uint256 gameId) public {
        battleShip.move(x, gameId);
        battleShip.move(x, gameId);
        assertEq(battleShip.nextMoveId(), 2);
    }

    event MoveResult(uint256 id, uint8 result, uint256 indexed gameId);

    function testMoveResult(uint256 moveId, uint8 result, uint256 gameId) public {
        vm.expectEmit(address(battleShip));
        emit MoveResult(moveId, result, gameId);
        uint256[] memory inputs = new uint256[](1);
        inputs[0] = 0;
        ZoKratesStructs.Proof memory proof;
        battleShip.moveResult(moveId, result, gameId, proof, inputs);
    }
}
