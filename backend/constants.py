import json
import os

with open("../out/IGame.sol/IGame.json", 'r') as f:
    ABI = json.load(f)['abi']

PATH_TO_ZOKRATES = os.path.abspath("superhack-2023/zokrates/battleship/initialize/init.zok")
PATH_TO_PROOF = os.path.abspath("superhack-2023/zokrates/battleship/initialize/") 
# print(PATH_TO_PROOF)