// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IUpgradeable {
    //https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/proxy/utils/UUPSUpgradeable.sol#L68
    function upgradeTo(address newImplementation) external;
}
