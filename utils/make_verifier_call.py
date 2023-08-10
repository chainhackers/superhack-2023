#!/usr/bin/env python3
import sys
import json

def encode_struct(struct):
    if isinstance(struct, dict):
        fmt = "({})".format(",".join("{}" for _ in struct))
        return fmt.format(*(encode_struct(it) for it in struct.values()))
    elif isinstance(struct, list):
        fmt = "[{}]".format(",".join("{}" for _ in struct))
        return fmt.format(*(encode_struct(it) for it in struct))
    else:
        return str(int(struct, 0))


def parse_proof(proof):
    return {
        "method_signature": "'verifyTx(((uint,uint),(uint[2],uint[2]),(uint,uint)),uint[{})'".format(len(proof["inputs"])),
        "proof": "'({})'".format(encode_struct(proof["proof"])),
        "inputs": "'{}'".format(encode_struct(proof["inputs"])),
    }


def parse_proof_from_file(proof_path):
    with open(proof_path, 'r') as f:
        proof_data = json.load(f)

    return parse_proof(proof_data)

def main():
    proof_path = sys.argv[1]

    proof = parse_proof_from_file(proof_path)

    call_str = "{} {} {}".format(proof["method_signature"], proof["proof"], proof["inputs"])
    print(call_str)


if __name__ == '__main__':
    main()
