// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Script, console2} from "forge-std/Script.sol";
import "../src/BattleShip.sol";

contract BattleShipDeploy is Script {
    //Goerli
    address constant REGISTRY = 0x15009Cbe24D1bFA83ABeCD177a5cd00B0D069AC0;

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployerAddr = vm.addr(deployerPrivateKey);

        vm.startBroadcast(deployerPrivateKey);

        BattleShip battleShip = new BattleShip();

        vm.stopBroadcast();
    }
}
