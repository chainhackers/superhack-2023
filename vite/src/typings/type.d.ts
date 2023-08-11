import {GameId} from "./types";
import {WalletClient} from "wagmi";
import {actionTypes} from "../store/actionTypes";
import {walletActionTypes} from "../store/wallet/walletActionTypes";
import {modalActionTypes} from "../store/modal/modalActionTypes";
import {providers} from "ethers";

interface RootState {
    game: GameState;
    wallet: WalletState;
    api: ApiState;
    modal: ModalState;
}
type RootAction = AnyAction;
type RootDispatchType = GameDispatchType & WalletDispatchType & ApiDispatchType
    & ModalDispatchType;

interface IGame {
    id: GameId
    moveId: number
    moveResult: number
}

interface ITransaction {
    hash: string
    network: string
    progress: number
}

type GameState = {
    info?: IGame,
    transaction?: ITransaction,
}

type ManageGameAction = {
    type: actionTypes.ADD_GAME | actionTypes.REMOVE_GAME;
    game: IGame;
}

type SetMoveIdAction = {
    type: actionTypes.SET_MOVE_ID;
    moveId: number;
}

type SetMoveResultAction = {
    type: actionTypes.SET_MOVE_RESULT;
    moveResult: number;
}

type StartTransactionAction = {
    type: actionTypes.START_TRANSACTION;
    transaction: ITransaction;
}

type EndTransactionAction = {
    type: actionTypes.END_TRANSACTION;
}

type ChangeTransactionProgressAction = {
    type: actionTypes.CHANGE_TRANSACTION_PROGRESS;
    progress: number;
}

type GameAction = ManageGameAction | SetGameActiveAction | SetMoveIdAction | SetMoveResultAction
    | StartTransactionAction | EndTransactionAction | ChangeTransactionProgressAction;
type GameDispatchType = (args: ManageGameAction) => GameAction;


interface WalletState {
    client?: WalletClient;
    signer?: providers.JsonRpcSigner;
    chainFormattedName?: string;
    isConnected: boolean;
}

type ManageWalletAction = {
    type: walletActionTypes.CONNECT_WALLET | walletActionTypes.DISCONNECT_WALLET;
    client: WalletClient;
    signer: providers.JsonRpcSigner;
}

type WalletAction = ManageWalletAction;

type WalletDispatchType = (args: WalletAction) => WalletAction;

interface ApiState {
    status: ApiStatus;
}

type ApiAction = {
    type: actionTypes.CHANGE_API_STATUS;
    status: ApiStatus;
}

export enum ApiStatus {
    IDLE = "IDLE",
    STARTED = "STARTED",
    PENDING = "PENDING",
    WAITING_RESPONSE = "WAITING_RESPONSE",
    SUCCESS = "SUCCESS",
    ERROR = "ERROR",
}

type ApiDispatchType = (args: ApiAction) => ApiAction;

interface ModalState {
    isOpen: boolean;
    title: string;
    modalType: ModalType;
    onConfirm?: () => void;
    onCancel?: () => void;
}

export enum ModalType {
    DEFAULT = "DEFAULT",
    WALLET_CONNECT = "WALLET_CONNECT",
}

type OpenModalAction = {
    type: modalActionTypes.OPEN_MODAL;
    title: string;
    modalType: ModalType;
    onConfirm?: () => void;
    onCancel?: () => void;
}

type CloseModalAction = {
    type: modalActionTypes.CLOSE_MODAL;
}

type ModalAction = OpenModalAction | CloseModalAction;

type ModalDispatchType = (args: ModalAction) => ModalAction;
