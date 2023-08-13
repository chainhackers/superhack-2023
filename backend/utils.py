import json


def encode_struct(struct):
    if isinstance(struct, dict):
        return [encode_struct(it) for it in struct.values()]
    elif isinstance(struct, list):
        return [encode_struct(it) for it in struct]
    else:
        return int(struct, 0)


def parse_proof(proof):
    return encode_struct(proof["proof"]), encode_struct(proof["inputs"])


def parse_proof_from_file(proof_path):
    with open(proof_path, 'r') as f:
        proof_data = json.load(f)

    return parse_proof(proof_data)
