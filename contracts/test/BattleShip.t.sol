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

    function testMoveResult(uint256 moveId, uint8 result) public {
//        uint256 gameId = 0;
//        vm.expectEmit(address(battleShip));
//        ZoKratesStructs.Proof memory init_proof;
//        init_proof.a.X = 21044006250626849392512137145118525046901307521118196102650758714570591311416;
//        init_proof.a.Y = 11803256754160082159084690767458575331145277361713358571155292246126690947438;
//        init_proof.b.X[0] = 20425196693552244661440875896836974954307740997102740755003756600729506988973;
//        init_proof.b.X[1] = 17607079519351227491946449877348564881836598325502209679760154196097367731166;
//        init_proof.b.Y[0] = 3056827203400409322496239158019749261548626180371516403760091194612507782544;
//        init_proof.b.Y[1] = 5060237513869551360365404040049275332356294239508703450509466721783434846213;
//        init_proof.c.X = 17317257771549215941692174060672937568489172122200971232719517954357418023724;
//        init_proof.c.Y = 17753459494452968309550756931291734009861398288559206545459137875807658497964;
//        uint256[] memory init_inputs = new uint256[](1);
//        init_inputs[0] = 2076890246081713472268316542736540644653909045569776834776356074142637472767;
//        battleShip.initGame(gameId, init_proof, init_inputs);

//        vm.expectEmit(address(battleShip));
//        emit MoveResult(moveId, result, gameId);
//        uint256[] memory inputs = new uint256[](3);
//        inputs[0] = 0;
//        ZoKratesStructs.Proof memory proof;
//        proof.a.X = 2042359672758871969889674730256950517492225659692003374623556250988635114112;
//        proof.a.Y = 12725466502042917368147668866313102347487933243368992698035879173026794524127;
//        proof.b.X[0] = 13339599098875765820113675307988792977543798094025832120715098143052990288154;
//        proof.b.X[1] = 1155271601398055400434249955858198359932153021462157990956861603140127449640;
//        proof.b.Y[0] = 11779194337031197317510030824068237814715907128395181690383871330704352106494;
//        proof.b.Y[1] = 4738045440709998873093140751980519828643369476260545187370332146765406259015;
//        proof.c.X = 21007435684152013647693517570466162500786711083528867798131575706914783171889;
//        proof.c.Y = 10882598507024705599889505923834276791493671684152202058935735749094733039785;
//        inputs[0] = 2076890246081713472268316542736540644653909045569776834776356074142637472767;
//        inputs[1] = 62;
//        inputs[2] = 1;
//        battleShip.moveResult(moveId, result, gameId, proof, inputs);
    }
}
