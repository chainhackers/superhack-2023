// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Script, console2} from "forge-std/Script.sol";
import "../src/interfaces/IGameRegistry.sol";
import "../src/GameRegistry.sol";

import {ERC1967Proxy} from "../lib/openzeppelin-contracts/contracts/proxy/ERC1967/ERC1967Proxy.sol";

contract DeployScript is Script {
    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployerAddr = vm.addr(deployerPrivateKey);

        vm.startBroadcast(deployerPrivateKey);

        address grid = address(new GameRegistry());
        bytes memory data = abi.encodeCall(
            GameRegistry.initialize,
            "https://arweave.net/rip5RY1wf8gKBl5CxEAKQHG9tc09SqyMFwJDOYT8xX0/{id}");
        address proxy = address(new ERC1967Proxy(grid, data));

        GameRegistry registry = GameRegistry(proxy);
        assert(registry.owner() == deployerAddr);

        vm.stopBroadcast();
    }
}
