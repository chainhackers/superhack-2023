import {ethers} from 'ethers';
import {ContractMethodRequest} from "./contractMethodRequest";
import {store} from "@store";
import {ApiStatus} from "@stateTypes";
import {changeApiStatus} from "../store/api/apiActions";
import {endTransaction, startTransaction} from "../store/game/gameActions";
import abi from "@abi"

async function executeContract(
    request: ContractMethodRequest,
): Promise<ethers.Event[] | null> {
    store.dispatch(changeApiStatus(ApiStatus.STARTED));

    // Промис, который будет отклонен через 60 секунд
    const timeoutPromise = new Promise((reject) => {
        setTimeout(() => reject(new Error('Transaction timed out')), 60000);
    });

    try {
        console.log('executeContract: chain = ', request.chain);
        console.log('executeContract: eventName = ', request.eventName);
        console.log('executeContract: methodName = ', request.methodName);
        console.log('executeContract: params = ', request.getOptionalValues());

        const contract = await getGameContract(request.chain);

        const options: ethers.PayableOverrides = await getOptions(request);

        const txPromise = contract[request.methodName](...request.getOptionalValues(), options);
        const tx = await Promise.race([txPromise, timeoutPromise]);

        console.log('executeContract: Transaction Hash = ', tx.hash);

        store.dispatch(startTransaction(tx.hash));
        store.dispatch(changeApiStatus(ApiStatus.PENDING));

        const receipt = await tx.wait();
        console.log('executeContract: receipt = ', receipt);
        store.dispatch(changeApiStatus(ApiStatus.WAITING_RESPONSE));

        return receipt.events?.filter((e: ethers.Event) => {
            console.log('executeContract: e.event = ', e.event);
            return e.event === request.eventName;
        }) || null;

    } catch (error) {
        store.dispatch(endTransaction())
        store.dispatch(changeApiStatus(ApiStatus.ERROR));
        console.error('executeContract: An error occurred = ', error);
        return null;
    }
}

export const sendMove = async (
    x: number,
    y: number,
): Promise<MoveResult[]> => {
    console.log('sendMove: start = ', { x, y });
    const chainName = store.getState().wallet.chainFormattedName;
    const request = ContractMethodRequest.create(chainName, 'MoveSent', 'sendMove')
        .withX(x)
        .withY(y);
    const resultEvents = await executeContract(request);
    const moveResult = resultEvents == null ? [] : resultEvents.map(event => event.args as unknown as MoveResult);
    console.log('sendMove: end = ', moveResult);
    return moveResult;
}

export const getGameInfo = async (
    x: number,
    y: number,
): Promise<GameInfoResult[]> => {
    console.log('getGameInfo: start = ', { x, y });
    const chainName = store.getState().wallet.chainFormattedName;
    const request = ContractMethodRequest.create(chainName, 'GameInfo', 'getGameInfo')
        .withX(x)
        .withY(y);
    const resultEvents = await executeContract(request);
    const gameInfoResult = resultEvents == null ? [] : resultEvents.map(event => event.args as unknown as GameInfoResult);
    console.log('getGameInfo: end = ', gameInfoResult);
    return gameInfoResult;
}

async function getGameContract(
    chain: string,
): Promise<ethers.Contract> {
    console.log('getGameContract: chain = ', chain);
    const contractAddress: string = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    console.log('getGameContract: contractAddress = ', contractAddress);
    const signer = store.getState().wallet.signer;
    console.log('getGameContract: signer = ', signer);
    console.log('getGameContract: chainAbi = ', abi);
    return new ethers.Contract(contractAddress, abi, signer);
}

const getOptions = async (request: ContractMethodRequest): Promise<ethers.PayableOverrides> => {
    return {
        gasLimit: 500000,
    };
}
