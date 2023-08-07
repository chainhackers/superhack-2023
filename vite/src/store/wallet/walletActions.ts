import {walletActionTypes} from "./walletActionTypes";
import {ManageWalletAction} from "@stateTypes";
import {WalletClient} from "wagmi";
import {walletClientToSigner} from "../../wagmi/ethers";

export function connectWallet(client: WalletClient): ManageWalletAction {
    return {
        type: walletActionTypes.CONNECT_WALLET,
        client: client,
        signer: client == null ? undefined : walletClientToSigner(client),
    };
}

export function disconnectWallet(): ManageWalletAction {
    return {
        type: walletActionTypes.DISCONNECT_WALLET,
        client: undefined,
        signer: undefined,
    }
}
