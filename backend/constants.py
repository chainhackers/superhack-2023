import json

with open("../out/IGame.sol/IGame.json", 'r') as f:
    ABI = json.load(f)['abi']
