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
            }, 2000); // 2 seconds delay
        }

        return () => {
            clearInterval(interval);
        };
    }, [isOpen, progress]);

    if (!isVisible) return null;

    return (
        <>
            {/*<Overlay/>*/}
            <div className={classes.transactionPendingModal}>
                <div className={classes.statusIcon}>
                    {getIcon(apiStatus)}
                </div>
                <div className={classes.frame10295}>
                    <div className={classes.frame10293}>
                        <p className={classes.pendingTransaction}>
                            {getContent(apiStatus)}
                        </p>
                    </div>
                    <div className={classes.frame10391}>
                        <div className={classes.frame10392}>
                            <div className={classes.group3}>
                                <div className={classes.transactionStatus}
                                     style={{ backgroundColor: progress >= 1 ? "white" : "gray" }}></div>
                                <div className={classes.transactionStatus}
                                     style={{ backgroundColor: progress >= 2 ? "white" : "gray" }}></div>
                                <div className={classes.transactionStatus}
                                     style={{ backgroundColor: progress >= 3 ? "white" : "gray" }}></div>
                                <div className={classes.transactionStatus}
                                     style={{ backgroundColor: progress >= 4 ? "white" : "gray" }}></div>
                            </div>
                        </div>

                    </div>
                    <TransactionLink transactionHash={transaction?.hash} transactionNetwork={transaction?.network} />
                </div>
            </div>
        </>
    );
};

const getIcon = (apiStatus: ApiStatus): string => {
    switch (apiStatus) {
        case ApiStatus.STARTED:
            return '🏦';
        case ApiStatus.PENDING:
            return '🌐';
        case ApiStatus.WAITING_RESPONSE:
            return '🕐';
        case ApiStatus.SUCCESS:
            return '✅';
        case ApiStatus.ERROR:
            return '❌';
        default:
            return '';
    }
}

const getContent = (apiStatus: ApiStatus): string => {
    switch (apiStatus) {
        case ApiStatus.STARTED:
            return 'CONFIRMATION';
        case ApiStatus.PENDING:
            return 'PENDING';
        case ApiStatus.WAITING_RESPONSE:
            return 'WAITING RESPONSE';
        case ApiStatus.SUCCESS:
            return 'SUCCESS';
        case ApiStatus.ERROR:
            return 'ERROR';
        default:
            return '';
    }
}

const getProgress = (apiStatus: ApiStatus): number => {
    switch (apiStatus) {
        case ApiStatus.STARTED:
            return 1;
        case ApiStatus.PENDING:
            return 2;
        case ApiStatus.WAITING_RESPONSE:
            return 3;
        case ApiStatus.SUCCESS:
            return 4;
        case ApiStatus.ERROR:
            return 0;
        default:
            return 0;
    }
}

export default Popup;
