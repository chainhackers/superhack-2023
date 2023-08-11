## Battleship game zokrates implementation

There are two proover contracts, one for generating game board hash and one for checking if the move is valid.

### Game initializer
Prepare proover and validator
```shell
cd initialize
zokrates compile -i init.zok
zokrates setup
zokrates export-verifier
```
Use prover to generate zk-prooved game hash
```shell
zokrates compute-witness -a 0 0 0 1 1 1 2 2 0 3 3 1 4 4 0
zokrates generate-proof
```

### Move validator
Prepare proover and validator
```shell
cd handle_move
zokrates compile -i handle_move.zok
zokrates setup
zokrates export-verifier
```
Use prover to generate zk-prooved game hash
```shell
zokrates compute-witness -a 0 0 0 1 1 1 2 2 0 3 3 1 4 4 0 4977210204351870616865782019335749618795865340124422421664033003906382406852 1 1
zokrates generate-proof
```

### Possible compilation issues
Ensure you have correct envvar
```shell
export ZOKRATES_STDLIB=<ZOKRATES_DIR>/stdlib
```
