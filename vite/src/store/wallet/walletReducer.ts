import {walletActionTypes} from "./walletActionTypes";
import {WalletAction, WalletState} from "@stateTypes";

const initialState: WalletState = {
    isConnected: false,
};

const walletReducer = (
    state: WalletState = initialState,
    action: WalletAction
): WalletState => {
    switch (action.type) {
        case walletActionTypes.CONNECT_WALLET:
            return {
                ...state,
                client: action.client,
                signer: action.signer,
                chainFormattedName: getChainFormattedName(action.client.chain.name),
                isConnected: true,
            }
        case walletActionTypes.DISCONNECT_WALLET:
            return {
                ...state,
                client: action.client,
                signer: action.signer,
                chainFormattedName: undefined,
                isConnected: false,
            }
        default:
            return state;
    }
}

const getChainFormattedName = (chainName: string): string => {
    return chainName.charAt(0).toLowerCase() + chainName.slice(1).replace(/\s/g, '');
}

export default walletReducer;
