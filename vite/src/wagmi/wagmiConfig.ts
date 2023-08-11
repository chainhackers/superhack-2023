import { publicProvider } from 'wagmi/providers/public';
import {configureChains, createConfig} from "wagmi";
import {polygonMumbai, polygon} from "@wagmi/core/chains";
import {Chain, getDefaultWallets} from "@rainbow-me/rainbowkit";
import {baseGoerli, goerli} from "viem/chains";

export const { chains, publicClient } = configureChains(
    [goerli],
    [
        publicProvider()
    ]
);
const { connectors } = getDefaultWallets({
    appName: 'Infini Quilt',
    projectId: process.env.WAGMI_PROJECT_ID,
    chains
});

export const wagmiConfig = createConfig({
    autoConnect: true,
    connectors,
    publicClient,
})
