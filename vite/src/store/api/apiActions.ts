import {apiActionTypes} from "./apiActionTypes";
import {ApiAction, ApiStatus} from "@stateTypes";

export function changeApiStatus(status: ApiStatus): ApiAction {
    return {
        type: apiActionTypes.CHANGE_API_STATUS,
        status: status,
    };
}
