import React, { useEffect, useState } from 'react';
import classes from './Popup.module.css';
import { TransactionLink } from "./TransactionLink/TransactionLink";
import Overlay from "../Overlay/Overlay";
import { ApiStatus, RootState } from "@stateTypes";
import { useSelector } from "react-redux";

const activeStatusList = [ApiStatus.STARTED, ApiStatus.PENDING, ApiStatus.WAITING_RESPONSE];

export const Popup: React.FC = () => {
    const [progressView, setProgressView] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const apiStatus = useSelector((state: RootState) => state.api.status);
    const transaction = useSelector((state: RootState) => state.game.transaction);
    const isOpen = activeStatusList.includes(apiStatus);
    const progress = getProgress(apiStatus);

    useEffect(() => {
        let interval: NodeJS.Timer;

        if (isOpen) {
            setIsVisible(true);
            interval = setInterval(() => {
                setProgressView(oldProgress => {
                    if (oldProgress >= progress) {
                        clearInterval(interval);
                        return progress;
                    }
                    return oldProgress + 1;
                });
            }, 50);
        } else {
            setProgressView(progress);
            setTimeout(() => {
                setIsVisible(false);
                setProgressView(0);
            }, 2000); // Задержка 2 секунды
        }

        return () => {
            clearInterval(interval);
        };
    }, [isOpen, progress]);

    if (!isVisible) return null;

    return (
        <>
            <Overlay/>
            <div className={classes.transactionPendingModal}>
                <div className={classes.frame10295}>
                    <div className={classes.frame10293}>
                        <p className={classes.pendingTransaction}>
                            {getContent(apiStatus)}
                        </p>
                    </div>
                    <div className={classes.frame10391}>
                        <div className={classes.frame10392}>
                            <div className={classes.group3}>
                                <div className={classes.rectangle4} style={{ width: `${progressView}%` }}/>
                            </div>
                        </div>
                        <div className={classes.frame10393}>
                            <div className={classes.labelTwo}>
                                <TransactionLink transactionHash={transaction?.hash} transactionNetwork={transaction?.network} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className={classes.spacer}></div>
            </div>
        </>
    );
};

const getContent = (apiStatus: ApiStatus): string => {
    switch (apiStatus) {
        case ApiStatus.STARTED:
            return '🏦 Transaction requested, check your wallet';
        case ApiStatus.PENDING:
            return '🌐 Pending transaction';
        case ApiStatus.WAITING_RESPONSE:
            return '🕐 Waiting for response';
        case ApiStatus.SUCCESS:
            return '✅ Transaction success';
        case ApiStatus.ERROR:
            return '❌ Transaction error';
        default:
            return '';
    }
}

const getProgress = (apiStatus: ApiStatus): number => {
    switch (apiStatus) {
        case ApiStatus.STARTED:
            return 25;
        case ApiStatus.PENDING:
            return 80;
        case ApiStatus.WAITING_RESPONSE:
            return 90;
        case ApiStatus.SUCCESS:
            return 100;
        case ApiStatus.ERROR:
            return 0;
        default:
            return 0;
    }
}

export default Popup;
