import React from 'react'
import ReactDOM from 'react-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Provider } from "react-redux"

import App from './App'
import { store } from '@store'
import {WagmiConfig} from "wagmi";
import {chains, wagmiConfig} from './wagmi/wagmiConfig';
import {RainbowKitProvider} from "@rainbow-me/rainbowkit";

const queryClient = new QueryClient()

ReactDOM.render(
    <React.StrictMode>
        <WagmiConfig config={wagmiConfig}>
            <RainbowKitProvider chains={ chains }>
                <QueryClientProvider client={queryClient}>
                    <Provider store={store}>
                        <App/>
                    </Provider>
                </QueryClientProvider>
            </RainbowKitProvider>
        </WagmiConfig>
    </React.StrictMode>,
    document.getElementById('root'),
)
