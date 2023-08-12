// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

library Utils {
    /**
        * @dev Cantor pairing function for two signed ints (x, y) into a single int
        * @param x First int
        * @param y Second int
     */
    function pair(int256 x, int256 y) internal pure returns (uint256) {
        int256 z = ((x + y) * (x + y + 1)) / 2 + y;
        if (z < 0) {
            return uint256(- z * 2 - 1);
        }
        return uint256(z * 2);
    }
}
