import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'
import dotenvPlugin from 'vite-plugin-env-compatible'
import * as path from 'path'
import { nodePolyfills }  from 'vite-plugin-node-polyfills'

const aliases = {
    '@iGridAbi': path.resolve(__dirname, './src/api/contractAbis/iGrid.json'),
    '@contractAddresses': path.resolve(__dirname, './eth-sdk/contractAddresses.ts'),
    '@store': path.resolve(__dirname, './src/store/store.ts'),
    '@stateTypes': path.resolve(__dirname, './src/typings/type.d.ts'),
};

export default defineConfig({
    plugins: [reactRefresh(), dotenvPlugin(), nodePolyfills()],
    define: {
        'process.env': process.env,
    },
    resolve: {
        alias: {
            ...aliases,
        },
    },
    css: {
        modules: {
            localsConvention: 'camelCaseOnly',
        },
    },
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
    },
    server: {
        port: 8080,
    },
})
