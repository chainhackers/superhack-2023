import { publicProvider } from 'wagmi/providers/public';
import {configureChains, createConfig} from "wagmi";
import {polygonMumbai, polygon} from "@wagmi/core/chains";
import {Chain, getDefaultWallets} from "@rainbow-me/rainbowkit";

const localAnvil: Chain = {
    id: 31_337,
    name: 'Local Anvil',
    network: 'anvil',
    nativeCurrency: {
        decimals: 18,
        name: 'Ethereum',
        symbol: 'ETH',
    },
    rpcUrls: {
        public: { http: [process.env.RPC_URL] },
        default: { http: [process.env.RPC_URL] },
    },
    testnet: true,
};


export const { chains, publicClient } = configureChains(
    [localAnvil],
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
