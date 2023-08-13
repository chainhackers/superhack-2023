import React, {useEffect} from 'react';
import {connectWallet, disconnectWallet} from "./store/wallet/walletActions";
import {useDispatch, useSelector} from "react-redux";
import {useWalletClient} from "wagmi";
import {ConnectButton} from "@rainbow-me/rainbowkit";
import './styles.css';
import * as Api from "./api/api"
import GameView from "./components/gameView/GameView";
import Popup from "./components/Popup/Popup";
import {RootState} from "@stateTypes";

const App: React.FC = () => {
    const dispatch = useDispatch();
    const { data: walletClient } = useWalletClient();
    const isWalletConnected: boolean = useSelector((state: RootState) => state.wallet.isConnected);

    useEffect(() => {
        if (walletClient == null) {
            dispatch(disconnectWallet())
        } else {
            dispatch(connectWallet(walletClient));
        }
    }, [dispatch, walletClient]);

    return (
        <div>
            <div id="navbar">
                <div></div>
                <ConnectButton/>
            </div>
            <div id="container">
                <GameView/>
                <Popup/>
            </div>
        </div>
    );
};

export default App;
