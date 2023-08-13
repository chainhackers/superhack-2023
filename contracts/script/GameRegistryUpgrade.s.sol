// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Script, console2} from "forge-std/Script.sol";
import "../src/interfaces/IGameRegistry.sol";
import "../src/GameRegistry.sol";
import "./IUpgradeable.sol";

import {ERC1967Proxy} from "../lib/openzeppelin-contracts/contracts/proxy/ERC1967/ERC1967Proxy.sol";

contract GameRegistryUpgrade is Script {
    //Goerli
    address constant REGISTRY = 0x15009Cbe24D1bFA83ABeCD177a5cd00B0D069AC0;

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployerAddr = vm.addr(deployerPrivateKey);

        vm.startBroadcast(deployerPrivateKey);

        address newGrid = address(new GameRegistry());
        bytes memory data = abi.encodeCall(
            GameRegistry.initialize,
            "https://arweave.net/rip5RY1wf8gKBl5CxEAKQHG9tc09SqyMFwJDOYT8xX0/{id}");
        IUpgradeable(REGISTRY).upgradeTo(newGrid);

        GameRegistry registry = GameRegistry(REGISTRY);
        assert(registry.owner() == deployerAddr);

        vm.stopBroadcast();
    }
}
