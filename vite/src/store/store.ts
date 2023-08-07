import { createStore, applyMiddleware, Store } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./rootReducer";
import {RootAction, RootDispatchType, RootState} from "@stateTypes";

export const store: Store<RootState, RootAction> & {
    dispatch: RootDispatchType
} = createStore(rootReducer, applyMiddleware(thunk));

