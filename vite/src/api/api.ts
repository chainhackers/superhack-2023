import {ethers} from 'ethers';
import {ContractMethodRequest} from "./contractMethodRequest";
import {store} from "@store";
import {ApiStatus} from "@stateTypes";
import {changeApiStatus} from "../store/api/apiActions";
import {endTransaction, startTransaction} from "../store/game/gameActions";
import iGridAbi from "@iGridAbi"

async function executeContract(
    request: ContractMethodRequest,
): Promise<ethers.Event[] | null> {
    store.dispatch(changeApiStatus(ApiStatus.STARTED));

    // Promise will be declined in 60 seconds
    const timeoutPromise = new Promise((reject) => {
        setTimeout(() => reject(new Error('Transaction timed out')), 60000);
    });

    try {
        console.log('executeContract: chain = ', request.chain);
        console.log('executeContract: eventName = ', request.eventName);
        console.log('executeContract: methodName = ', request.methodName);
        console.log('executeContract: params = ', request.getOptionalValues());

        const contract = await getGameContract(request.chain);

        const options: ethers.PayableOverrides = await getOptions();

        const txPromise = contract[request.methodName](...request.getOptionalValues(), options);
        const tx = await Promise.race([txPromise, timeoutPromise]);

        console.log('executeContract: Transaction Hash = ', tx.hash);

        store.dispatch(startTransaction(tx.hash, request.chain));
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
    if (moveResult.length > 0) {
        store.dispatch(endTransaction())
        store.dispatch(changeApiStatus(ApiStatus.SUCCESS));
    }
    console.log('sendMove: end = ', moveResult);
    return moveResult;
}

export const getGameInfo = async (
    x: number,
    y: number,
): Promise<{gameId: number, game: string}> => {
    try {
        const chainName = store.getState().wallet.chainFormattedName;
        const contract = await getGameContract(chainName);
        const result = await contract.callStatic.getGameInfo(x, y);
        return {gameId: result[0], game: result[1]};
    } catch (error) {
        console.error('getGameInfoApi: An error occurred = ', error);
        throw error;
    }
}

export const getCellDetails = async (
    x: number,
    y: number,
): Promise<{game: string, coordinate: number, tokenType: number, tokenId: number, image: string}> => {
    try {
        const chainName = store.getState().wallet.chainFormattedName;
        const contract = await getGameContract(chainName);
        const result = await contract.callStatic.cellDetails(x, y);
        return {
            game: result[0],
            coordinate: result[1],
            tokenType: result[2],
            tokenId: result[3],
            image: result[4]
        };
    } catch (error) {
        console.error('getCellDetailsApi: An error occurred = ', error);
        throw error;
    }
}

async function getGameContract(
    chain: string,
): Promise<ethers.Contract> {
    console.log('getGameContract: chain = ', chain);
    const contractAddress: string = process.env.CONTRACT_ADDRESS;
    console.log('getGameContract: contractAddress = ', contractAddress);
    const signer = store.getState().wallet.signer;
    console.log('getGameContract: signer = ', signer);
    console.log('getGameContract: chainAbi = ', iGridAbi);
    return new ethers.Contract(contractAddress, iGridAbi, signer);
}

const getOptions = async (): Promise<ethers.PayableOverrides> => {
    return {
        gasLimit: 500000,
    };
}
