// This file is MIT Licensed.
//
// Copyright 2017 Christian Reitwiessner
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
pragma solidity ^0.8.0;

import "./pairing.sol";

contract BattleShipMoveVerifier {
    using Pairing for *;
    struct VerifyingKey {
        Pairing.G1Point alpha;
        Pairing.G2Point beta;
        Pairing.G2Point gamma;
        Pairing.G2Point delta;
        Pairing.G1Point[] gamma_abc;
    }
    struct Proof {
        Pairing.G1Point a;
        Pairing.G2Point b;
        Pairing.G1Point c;
    }
    function verifyingKey() pure internal returns (VerifyingKey memory vk) {
        vk.alpha = Pairing.G1Point(uint256(0x24eb7dcf286fc500c90cfdefa4c648b832eccca809201b769489e3b34c23d219), uint256(0x22466f2eb351c3b6ee7f18bfa8d1df12da8b4ff384d352b2c8498c1acba47a82));
        vk.beta = Pairing.G2Point([uint256(0x04241acadfc083b512f643ae57bec4040ce53315768f01c3b8a2fa2571b927fb), uint256(0x17fa3a0bc43b649f9d412cab2cb01ba6dca9d8fd179095461cefafbbb9f4583b)], [uint256(0x1512cf9ff5bd53d2638e579f884882b755ccc6c4a1363f2d6ce5d0b44247ed43), uint256(0x2a617f41856ccf6c016b2564fc2d8ecaa7d2c983812811cb0d44539cc520cf2e)]);
        vk.gamma = Pairing.G2Point([uint256(0x06b0a7d6f5c3bac670cce5d562635f526d579c4e20b8e2442e0a9b77ad1d81cb), uint256(0x2de28955d5b71eb88c1407340c1f712f036e6f6f0e280256d129cd420eea66db)], [uint256(0x2ce92cc7fcd5130b37c05815a2711efa36def7ad19de959c293f356701afcc85), uint256(0x099658b665826ba583fc582f2603c0be3866ddd8c050199ee512e2521bdf17f5)]);
        vk.delta = Pairing.G2Point([uint256(0x1f4dad204ca3fe5ea4f314c4d92d8a331cb735fd865c479b5061f92ca6c4d4ac), uint256(0x1b4cf2e4100bed8cfdef9e481aa5e716cca7cc20a0d69c0650f21be864a9d077)], [uint256(0x2723633ebf815d011bcddf75771c1abb1d2cb31edc8dc998570031c3438f9eb6), uint256(0x029e0b5a71bc552e9fadb5f67845a8e110cba4ba11bdb32ec6acf48f5b5250a0)]);
        vk.gamma_abc = new Pairing.G1Point[](4);
        vk.gamma_abc[0] = Pairing.G1Point(uint256(0x1e682af8ba06c093d42dd46b4bed072f90f5b080fa061660d426cfe24afb2b4a), uint256(0x1436e14cac59ea30ecc28504bdea6696e81048f75ce9f22066ead4c085b1f6ee));
        vk.gamma_abc[1] = Pairing.G1Point(uint256(0x2bf082c809b9ea97ba64fc895fe5278c5f8a2845a1ddca495ad83686faaf4d55), uint256(0x01914cfea3eb7bf87a5fc34735f3851af1846d7bc07e67bac4e8f02a4efae616));
        vk.gamma_abc[2] = Pairing.G1Point(uint256(0x17a6d89e94c14d69e00134bb70689e22b2f46f0c3be4db73d20905a737d160e7), uint256(0x07b48c1f6d49b24939c7ba49c374c3c5eb71a9d1e07b580f1954ce71740e711e));
        vk.gamma_abc[3] = Pairing.G1Point(uint256(0x26268bd40f6dccaf3da56e034447736ff760ebab758a3393c449d1e179d4c14e), uint256(0x26dd5a7cb7da0b76d56ddf493859c540548fc5b3ed5a00f42368a31a209f2a42));
    }
    function verify(uint[] memory input, Proof memory proof) internal view returns (uint) {
        uint256 snark_scalar_field = 21888242871839275222246405745257275088548364400416034343698204186575808495617;
        VerifyingKey memory vk = verifyingKey();
        require(input.length + 1 == vk.gamma_abc.length);
        // Compute the linear combination vk_x
        Pairing.G1Point memory vk_x = Pairing.G1Point(0, 0);
        for (uint i = 0; i < input.length; i++) {
            require(input[i] < snark_scalar_field);
            vk_x = Pairing.addition(vk_x, Pairing.scalar_mul(vk.gamma_abc[i + 1], input[i]));
        }
        vk_x = Pairing.addition(vk_x, vk.gamma_abc[0]);
        if(!Pairing.pairingProd4(
             proof.a, proof.b,
             Pairing.negate(vk_x), vk.gamma,
             Pairing.negate(proof.c), vk.delta,
             Pairing.negate(vk.alpha), vk.beta)) return 1;
        return 0;
    }
    function verifyTx(
            Proof memory proof, uint[3] memory input
        ) public view returns (bool r) {
        uint[] memory inputValues = new uint[](3);
        
        for(uint i = 0; i < input.length; i++){
            inputValues[i] = input[i];
        }
        if (verify(inputValues, proof) == 0) {
            return true;
        } else {
            return false;
        }
    }
}
