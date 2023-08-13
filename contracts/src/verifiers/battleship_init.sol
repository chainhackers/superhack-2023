// This file is MIT Licensed.
//
// Copyright 2017 Christian Reitwiessner
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
pragma solidity ^0.8.0;

import "./pairing.sol";

contract BattleShipInitVerifier {
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
        vk.alpha = Pairing.G1Point(uint256(0x145e7db2d89387a01ea892ec26dcc4813f2fd2f50f62898f550787d906782351), uint256(0x208bd6ef3d4ec2b5215adaaa51bb49a28b8bcb334bc56e652ea8089065ee51ce));
        vk.beta = Pairing.G2Point([uint256(0x2ffc090bc5bfbf2beaf400e7d9bff70eaca4087c5087c220ae75d7e29db5bf59), uint256(0x24ab3a9aeb54206f4a185f15de22681a0de4d725d93364df97c5d6ae538ee0cd)], [uint256(0x20309f81b0cb185207722e84b47c08d4272b1c693701ad55b81ff32404ae629c), uint256(0x1075135d1a6f447e46756ff6c607b7a10fa62b56fca12aa3274d9cc95b4e05d6)]);
        vk.gamma = Pairing.G2Point([uint256(0x0a917dbe3d0d2ed15a0bc8361f24ba31adc20c045df96d50c12d30782e6cb614), uint256(0x117d05f2c028fdeac2d617583ba5db5bfeff64e3e526811e328fc5486b23c188)], [uint256(0x01b618e3f597f118f1bc0617eb4062c1bac5ff642f06865e6d7198aaa95269f6), uint256(0x17778a48dc3bb73936bb6f1a112d061baec88c50a7eb46270c9583caf0bb835e)]);
        vk.delta = Pairing.G2Point([uint256(0x2e98265bbce55f473f92bcfc3e697d51ee7177d2d3dec2e65a48133b8253f6da), uint256(0x02984f02ba86388a6c4a9b0b978af36634298c42b8f9c0125ac394ae0f9927db)], [uint256(0x0876cdd59ba4c2351e6fbc5a7ecd430a604aefee8e76b003469388153c887426), uint256(0x01922c1e8143c02491b5c7c521efeeb684d7fe22f58d8599123ce13748bb0188)]);
        vk.gamma_abc = new Pairing.G1Point[](2);
        vk.gamma_abc[0] = Pairing.G1Point(uint256(0x281376a7caf5563b83dc0d87f28572673f0872eb2813e181f3cd47d6ef47ce36), uint256(0x124cc2bbafcb8125dc6b3006e564d3b8b936dd15c2a96ae6810391c0346783ca));
        vk.gamma_abc[1] = Pairing.G1Point(uint256(0x23944d7aacd6c7278a37b51e2e926fea5384c8c5c43d913a3ee5eb91c9400500), uint256(0x1ef07e4bf0b51917546a4a38a00841ca8723f24fbf4efabae207da8ef2b670e1));
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
            Proof memory proof, uint[1] memory input
        ) public view returns (bool r) {
        uint[] memory inputValues = new uint[](1);
        
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
