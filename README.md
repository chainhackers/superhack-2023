# InfiniQuilt: The Infinite Matrix of Possibilities
### Superhack 2023 entry by ChainHackers


## Run locally
#### Run Anvil
```shell
anvil
# ...
#Available Accounts
#==================
#
#(0) "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266" (10000.000000000000000000 ETH)
#(1) "0x70997970C51812dc3A010C7d01b50e0d17dc79C8" (10000.000000000000000000 ETH)
```
#### Deploy contracts
```shell
forge create --from 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 --unlocked src/GameRegistry.sol:GameRegistry
#[⠰] Compiling...
#[⠒] Compiling 1 files with 0.8.21
#[⠑] Solc 0.8.21 finished in 51.31ms
#Compiler run successful!
#Deployer: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
#Deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
#Transaction hash: 0x494e49d81ee1908846c3cf4afa3d23f91f62df05e547ba51052cbdbf505981a5


forge create --from 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 --unlocked src/BattleShip.sol:BattleShip

#[⠆] Compiling...
#No files changed, compilation skipped
#Deployer: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
#Deployed to: 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
#Transaction hash: 0x83755c0a424f806146fef97c406bd98d26ba82222eaf50b1369e9ed2df8f0f0a
```

#### Generate events with Cast
[Foundry Book / cast-send](https://book.getfoundry.sh/reference/cast/cast-send)
```shell
cast call 0x5FbDB2315678afecb367f032d93F642f64180aa3 'isGame(address)(bool)' '0x5FbDB2315678afecb367f032d93F642f64180aa3'  
#false

cast send --from 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 --unlocked 0x5FbDB2315678afecb367f032d93F642f64180aa3 'registerGame(address)' '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'

#blockHash               0x2af3c106d6c66612405fc332eced0e7b17e1ec861194417b596c6b85a17698ff
#blockNumber             2
#contractAddress         
#cumulativeGasUsed       73221
#effectiveGasPrice       3877762609
#gasUsed                 73221
#logs                    [{"address":"0x5fbdb2315678afecb367f032d93f642f64180aa3","topics":["0x34b9617f9af722d32f1a42d0e74b77288e4b0de7a0d9233b81ea44fd4a87bfd8","0x0000000000000000000000000000000000000000000000000000000000000001","0x00000000000000000000000070997970c51812dc3a010c7d01b50e0d17dc79c8","0x000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb92266"],"data":"0x","blockHash":"0x2af3c106d6c66612405fc332eced0e7b17e1ec861194417b596c6b85a17698ff","blockNumber":"0x2","transactionHash":"0xc7590ea46bf3861572f0db32424291324b635c13b1a3bc142e2f961ab685a0f1","transactionIndex":"0x0","logIndex":"0x0","transactionLogIndex":"0x0","removed":false}]
#logsBloom               0x00000000000000000002000000000000000000004000000000000000000000000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000040000000000000000000000000840000000000000000100000000000000000080000000000000000000000000000000000000000000000000000000080000000000000000000200000000000000000000000000000000000000000000000000000000000000000000000000000040000000200000000000000000000000002000000000000000000040000000000000000000000000000000000001000000000000000000000000000000
#root                    
#status                  1
#transactionHash         0xc7590ea46bf3861572f0db32424291324b635c13b1a3bc142e2f961ab685a0f1
#transactionIndex        0
#type                    2
```