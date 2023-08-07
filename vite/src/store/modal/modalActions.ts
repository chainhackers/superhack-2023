import {modalActionTypes} from "./modalActionTypes";
import {CloseModalAction, ModalType, OpenModalAction} from "@stateTypes";

export function openModal(title: string, type: ModalType ,onConfirm?: () => void, onCancel?: () => void): OpenModalAction {
    return {
        type: modalActionTypes.OPEN_MODAL,
        title: title,
        modalType: type,
        onConfirm: onConfirm,
        onCancel: onCancel,
    };
}

export function closeModal(): CloseModalAction {
    return {
        type: modalActionTypes.CLOSE_MODAL,
    }
}


