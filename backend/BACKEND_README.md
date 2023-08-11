### Backend
Add this to make sure everyone can run it whenever needed.
Commands that you should run before running anything in this folder.
```shell
anvil

forge create --from 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 --unlocked src/GameRegistry.sol:GameRegistry

forge create --from 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 --unlocked src/BattleShip.sol:BattleShip
#Return 
#Deployer: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
#Deployed to: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512  
# TAKE <Deployed to> TO BATTLESHIP.PY --CONTRACT_ADDRESS AS ARGUMENT
# AND TO cast send move(uint8, uint256) as --unlocked address


cast call 0x5FbDB2315678afecb367f032d93F642f64180aa3 'isGame(address)(bool)' '0x5FbDB2315678afecb367f032d93F642f64180aa3'
# false  JUST CHECK 

cast send --from 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 --unlocked 0x5FbDB2315678afecb367f032d93F642f64180aa3 'registerGame(address)' '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'

cast send --from 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 --unlocked 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512 'move(uint8, uint256)' 12 12
# This one is optional, it is move sender so you can just run event_generator.py
```
## Python
To run python scripts you have to install python, create and activate virtual environment

```
python -m venv venv
```
for windows
```
source venv/Scripts/activate 
pip install -r requirements.txt
```

The game logic is at battleship.py file, so you should run it using command:
```
python battleship.py --rpc_url "http://localhost:8545/" --contract_address "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512" --zokrates_executable_location "path to zokrates executable location"
```
If you do not want to run events manually there is a script that will generate players moves to each cell from 0 to 99.
Run it using command:
```
python ./local_testing/event_generator.py
```
To see the result look at log_file ./log.txt
Each user's move will be there with exact info e.g
- 2023-08-09 04:19:13,379 - INFO - User hit empty cell. Coord: 18
Contains info with result from game logic.
- 2023-08-09 04:19:13,391 - INFO - SEND TRANSACTION WITH RESULT Loss TO CONTRACT
Contains result e.g Loss, Win to contract and transaction hash
- 2023-08-09 04:19:13,391 - INFO - {'id': 19, 'move': 18, 'gameId': 1, 'player': '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'}
Contains move_id, coordinate that player chose to open, gameId and players address

