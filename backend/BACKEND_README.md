
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
# false  CHECK 

cast send --from 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 --unlocked 0x5FbDB2315678afecb367f032d93F642f64180aa3 'registerGame(address)' '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'

cast send --from 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 --unlocked 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512 'move(uint8, uint256)' 12 12

cast send --from 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 --unlocked 0x051dA0102b02353E77BCc52BE3beddF95B399443 "deposit(address,uint256)" 0x051dA0102b02353E77BCc52BE3beddF95B399443 1
```