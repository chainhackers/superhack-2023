import React, {memo} from "react";
import classes from "./TransactionLink.module.css";
import { mainnet, polygonMumbai, polygon, goerli } from '@wagmi/core/chains'

interface TransactionLinkProps {
    transactionHash: string;
    transactionNetwork: string;
}

export const TransactionLink: React.FC<TransactionLinkProps> = memo(({ transactionHash, transactionNetwork }) => {
    const transactionLink = getTransactionLink(transactionHash, transactionNetwork);

    if (!transactionLink) return null;

    return (
        <a href={transactionLink} target="_blank" rel="noopener noreferrer" className={classes.label}>
            See on Explorer
        </a>
    );
});

const getTransactionLink = (transactionHash: string, network: string) => {
    if (!transactionHash || !network) return '';
    const explorerBaseURL = getExplorerBaseURL(network);
    return `${explorerBaseURL}/tx/${transactionHash}`;
}

const getExplorerBaseURL = (network: string) => {
    switch(network) {
        case 'mainnet': return mainnet.blockExplorers.default.url;
        case 'polygon': return polygon.blockExplorers.default.url;
        case 'polygonMumbai': return polygonMumbai.blockExplorers.default.url;
        case 'goerli': return goerli.blockExplorers.default.url;
        default:
            console.error(`Unknown network: ${network}`);
            return '';
    }
}
