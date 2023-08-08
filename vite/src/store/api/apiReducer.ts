import {apiActionTypes} from "./apiActionTypes";
import {ApiAction, ApiState, ApiStatus} from "@stateTypes";

const initialState: ApiState = {
    status: ApiStatus.IDLE,
};

const apiReducer = (
    state: ApiState = initialState,
    action: ApiAction
): ApiState => {
    switch (action.type) {
        case apiActionTypes.CHANGE_API_STATUS:
            return {
                ...state,
                status: action.status,
            }
        default:
            return state;
    }
}

export default apiReducer;
