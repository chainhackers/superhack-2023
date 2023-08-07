import {gameActionTypes} from "./gameActionTypes";
import {
    ManageGameAction,
    IGame,
    StartTransactionAction, EndTransactionAction, ChangeTransactionProgressAction, SetMoveIdAction, SetMoveResultAction
} from "@stateTypes";

export function addGame(game: IGame): ManageGameAction {
    return {
        type: gameActionTypes.ADD_GAME,
        game,
    };
}

export function removeGame(game: IGame): ManageGameAction {
    return {
        type: gameActionTypes.REMOVE_GAME,
        game,
    }
}

export function SetMoveId(moveId: number): SetMoveIdAction {
    return {
        type: gameActionTypes.SET_MOVE_ID,
        moveId,
    }
}

export function SetMoveResult(moveResult: number): SetMoveResultAction {
    return {
        type: gameActionTypes.SET_MOVE_RESULT,
        moveResult,
    }
}

export function startTransaction(hash: string): StartTransactionAction {
    return {
        type: gameActionTypes.START_TRANSACTION,
        transaction: {
            hash: hash,
            progress: 0,
        }
    }
}

export function endTransaction(): EndTransactionAction {
    return {
        type: gameActionTypes.END_TRANSACTION,
    }
}

export function changeTransactionProgress(progress: number): ChangeTransactionProgressAction {
    return {
        type: gameActionTypes.CHANGE_TRANSACTION_PROGRESS,
        progress: progress,
    }
}
