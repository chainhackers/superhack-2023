import { combineReducers } from "redux";
import gameReducer from "./game/gameReducer";
import walletReducer from "./wallet/walletReducer";
import apiReducer from "./api/apiReducer";
import modalReducer from "./modal/modalReducer";

const rootReducer = combineReducers({
    game: gameReducer,
    wallet: walletReducer,
    api: apiReducer,
    modal: modalReducer,
})

export default rootReducer;
