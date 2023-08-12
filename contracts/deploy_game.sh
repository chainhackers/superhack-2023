#!/bin/bash

# ANVIL'S STANDART ADDRESS
DEPLOYER=0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
# CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
# Загружаем переменные среды из файла .env
source .env

# Запускаем локальное окружение Anvil. Если падает с ошибкой "thread 'main' panicked at
# 'error binding to 127.0.0.1:8545: error creating server listener: Обычно разрешается только одно использование адреса сокета..
# проверь что на этом порту не запущен анвил или что-либо ещё. попробуй перезапустить анвил на другом порте(дефолтный 8545)

anvil &> ./anvil_logs.txt &

#
forge compile

# Деплоим GameRegistry локально
CONTRACT_ADDRESS=$(forge create --from $DEPLOYER --unlocked src/GameRegistry.sol:GameRegistry | grep "Deployed to:" | awk '{print $NF}')
echo $CONTRACT_ADDRESS
# Деплоим BattleShip локально
forge create --from $DEPLOYER --unlocked src/BattleShip.sol:BattleShip


# Деплоим контракты на Goerli
forge script script/Deploy.s.sol:DeployScript --rpc-url "http://localhost:8545/" --broadcast --verify

# Отправляем ход игрока
response=$(cast send --rpc-url "http://localhost:8545/" --from $DEPLOYER --unlocked $CONTRACT_ADDRESS 'answerPlayerMove(uint256,uint256,uint8,uint256,bool)' 1 1 1 7 'false')
echo $response
# Проверяем ответ от контракта, чтобы убедиться, что ход игрока отвечен
if [[ $response == *"your_success_condition"* ]]; then
    echo "Ход игрока был успешно отвечен."
else
    echo "Ошибка при ответе на ход игрока."
fi
