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

##### Locally with Anvil
Deploy GameRegistry: 
```shell
forge create --from 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 --unlocked src/GameRegistry.sol:GameRegistry
```
```shell
#[⠰] Compiling...
#[⠒] Compiling 1 files with 0.8.21
#[⠑] Solc 0.8.21 finished in 51.31ms
#Compiler run successful!
#Deployer: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
#Deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
#Transaction hash: 0x494e49d81ee1908846c3cf4afa3d23f91f62df05e547ba51052cbdbf505981a5
```
Deploy BattleShip:  
```shell
forge create --from 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 --unlocked src/BattleShip.sol:BattleShip
```
```shell
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

#### Deploy Grid
```shell
forge create --from 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 --unlocked src/Grid.sol:Grid
```
```shell
No files changed, compilation skipped
Deployer: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Deployed to: 0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9
Transaction hash: 0x1e53671977fecff8e4d1a471d22725d9d54005dbff7a06f9e0928154b51200f6
```

#### Send move
```shell
cast send --from 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 --unlocked 0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9 'sendMove(uint256,uint256))' 1 15
```
```shell
blockHash               0xcdad7077711a730f0779ce72d651fad311a5bad7eacbc46ee05cfdaba36015f8
blockNumber             6
contractAddress
cumulativeGasUsed       90037
effectiveGasPrice       3516962609
gasUsed                 90037
logs                    [{"address":"0xdc64a140aa3e981100a9beca4e685f962f0cf6c9","topics":["0x9dc7e2343b01a49d71480770a0a85ad85e7836428c2201e413050893b8523982"],"data":"0x000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000001000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb92266","blockHash":"0xcdad7077711a730f0779ce72d651fad311a5bad7eacbc46ee05cfdaba36015f8","blockNumber":"0x6","transactionHash":"0x45fbd4510f4e327b4404f435c95d8c7154d5688f459531205ff3daf67394717e","transactionIndex":"0x0","logIndex":"0x0","transactionLogIndex":"0x0","removed":false}]
logsBloom               0x00000000000000000000000000000000000000000000000000000000000000000000000800000000000000000000008000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000001000000000100000000000000
root
status                  1
transactionHash         0x45fbd4510f4e327b4404f435c95d8c7154d5688f459531205ff3daf67394717e
transactionIndex        0
type                    2
```

## Deploy to Goerli
### Using `Deploy.s.sol`
Fill your `.env` file with:
```properties
GOERLI_RPC_URL=https://eth-goerli.g.alchemy.com/v2/XXXXXXXXXXXXXXXXXXXXXXXXXX_FIXME
PRIVATE_KEY=0xXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX_FIXME
ETHERSCAN_API_KEY=XXXXXXXXXXXXXXXXXXXXXXXXXXXX_FIXME
```
Source the .env file and deploy the contracts:
```shell
source .env
forge script script/Deploy.s.sol:DeployScript --rpc-url $GOERLI_RPC_URL --broadcast --verify
```
```shell
# ...
# Response: `OK`
#Details: `Pass - Verified`
#Contract successfully verified
#All (X) contracts were verified!
#
#Transactions saved to: ...
#
#Sensitive values saved to: ...
```
