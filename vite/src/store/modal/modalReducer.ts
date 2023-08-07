import {modalActionTypes} from "./modalActionTypes";
import {ModalAction, ModalState, ModalType} from "@stateTypes";

const initialState: ModalState = {
    isOpen: false,
    title: "",
    modalType: ModalType.DEFAULT,
};

const modalReducer = (
    state: ModalState = initialState,
    action: ModalAction
): ModalState => {
    switch (action.type) {
        case modalActionTypes.OPEN_MODAL:
            return {
                ...state,
                isOpen: true,
                title: action.title,
                modalType: action.modalType,
                onConfirm: action.onConfirm,
                onCancel: action.onCancel,
            }
        case modalActionTypes.CLOSE_MODAL:
            return {
                ...state,
                isOpen: false,
                title: "",
                onConfirm: undefined,
            }
        default:
            return state;
    }
}

export default modalReducer;
