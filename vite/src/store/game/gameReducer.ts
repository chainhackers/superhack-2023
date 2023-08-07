import {gameActionTypes} from "./gameActionTypes";
import {
    ManageGameAction,
    GameState,
    GameAction,
    StartTransactionAction,
    ChangeTransactionProgressAction, SetMoveIdAction, SetMoveResultAction
} from "@stateTypes";

const initialState: GameState = {}

const reducer = (
    state: GameState = initialState,
    action: GameAction
): GameState => {
    switch (action.type) {
        case gameActionTypes.ADD_GAME:
            return {
                ...state,
                info: (action as ManageGameAction).game,
            }
        case gameActionTypes.REMOVE_GAME:
            return {
                ...state,
                info: undefined,
            }
        case gameActionTypes.SET_MOVE_ID:
            return {
                ...state,
                info: {
                    ...state.info,
                    moveId: (action as SetMoveIdAction).moveId,
                }
            }
        case gameActionTypes.SET_MOVE_RESULT:
            return {
                ...state,
                info: {
                    ...state.info,
                    moveResult: (action as SetMoveResultAction).moveResult,
                }
            }
        case gameActionTypes.START_TRANSACTION:
            return {
                ...state,
                transaction: (action as StartTransactionAction).transaction,
            }
        case gameActionTypes.END_TRANSACTION:
            return {
                ...state,
                transaction: undefined,
            }
        case gameActionTypes.CHANGE_TRANSACTION_PROGRESS:
            return {
                ...state,
                transaction: {
                    ...state.transaction,
                    progress: (action as ChangeTransactionProgressAction).progress,
                }
            }
    }
    return state
}

export default reducer
