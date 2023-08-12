import json


with open("contracts/out/IGame.sol/IGame.json", 'r') as f:
    ABI = json.load(f)['abi']
