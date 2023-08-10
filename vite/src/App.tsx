import React, {useEffect} from 'react';
import {connectWallet, disconnectWallet} from "./store/wallet/walletActions";
import {useDispatch} from "react-redux";
import {useWalletClient} from "wagmi";
import {ConnectButton} from "@rainbow-me/rainbowkit";
import './styles.css';
import * as Api from "./api/api"
import GameView from "./components/gameView/GameView";
import Popup from "./components/Popup/Popup";

const App: React.FC = () => {
    const dispatch = useDispatch();
    const { data: walletClient } = useWalletClient();

    useEffect(() => {
        if (walletClient == null) {
            dispatch(disconnectWallet())
        } else {
            dispatch(connectWallet(walletClient));
        }
    }, [dispatch, walletClient]);

    const handleSendMove = () => {
        Api.sendMove(1, 1);
    };

    const handleGetGameInfo = () => {
        Api.getGameInfo(1, 1);
    };

    return (
        <div>
            <div id="navbar">
                <div>
                    <button onClick={handleSendMove}>Send move</button>
                    <button onClick={handleGetGameInfo}>Get game info</button>
                </div>
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
