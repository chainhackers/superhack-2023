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
    return "'({})'".format(encode_struct(proof["proof"])), "'{}'".format(encode_struct(proof["inputs"]))


def parse_proof_from_file(proof_path):
    with open(proof_path, 'r') as f:
        proof_data = json.load(f)

    return parse_proof(proof_data)
