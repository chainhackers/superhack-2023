// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Script, console2} from "forge-std/Script.sol";
import "../src/BattleShip.sol";

contract BattleShipDeploy is Script {
    //Goerli
    address constant REGISTRY = 0xeE4cdF3d437aD91628AEb49AF51d89172adb3442;

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployerAddr = vm.addr(deployerPrivateKey);

        vm.startBroadcast(deployerPrivateKey);

        BattleShip battleShip = new BattleShip();

        vm.stopBroadcast();
    }
}
