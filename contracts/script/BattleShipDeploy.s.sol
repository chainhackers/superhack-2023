// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Script, console2} from "forge-std/Script.sol";
import "../src/BattleShip.sol";
import "../src/verifiers/battleship_init.sol";
import "../src/verifiers/battleship_move.sol";

contract BattleShipDeploy is Script {
    //Goerli
    address constant REGISTRY = 0x15009Cbe24D1bFA83ABeCD177a5cd00B0D069AC0;
    address constant BACKEND = 0xb95A131ABF8c82aC9A3e9715Fb2eb1f7E2AAfcE8;

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployerAddr = vm.addr(deployerPrivateKey);

        vm.startBroadcast(deployerPrivateKey);
        
        BattleShipInitVerifier initVerifier = new BattleShipInitVerifier();
        BattleShipMoveVerifier moveVerifier = new BattleShipMoveVerifier();

        BattleShip battleShip = new BattleShip(
            IGameRegistry(REGISTRY),
            BACKEND,
            initVerifier,
            moveVerifier
        );

        vm.stopBroadcast();
    }
}
