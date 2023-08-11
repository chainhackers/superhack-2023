import json
import os

with open("contracts/out/IGame.sol/IGame.json", 'r') as f:
    ABI = json.load(f)['abi']

PATH_TO_MOVE_HANDLER = os.path.abspath("superhack-2023/zokrates/battleship/initialize")
PATH_TO_INIT_HANDLER = os.path.abspath("superhack-2023/zokrates/battleship/move_handler")
# print(PATH_TO_PROOF)
