import React, { useEffect } from 'react';
import Phaser from 'phaser';
import GameScene from '../../game/scenes/gameScene';
import PreloadGameScene from '../../game/scenes/preloadGameScene';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../../game/constants/gameConstants';
import {useSelector} from "react-redux";
import {RootState} from "@stateTypes";

const GameView: React.FC = () => {
    const elementId: string = 'phaser-game';
    const isWalletConnected: boolean = useSelector((state: RootState) => state.wallet.isConnected);

    useEffect(() => {
        if (!isWalletConnected) {
            return;
        }
        const backgroundColor = "#20293A";

        const config = {
            type: Phaser.AUTO,
            parent: elementId,
            backgroundColor,
            scale: {
                autoCenter: Phaser.Scale.CENTER_BOTH,
                mode: Phaser.Scale.FIT,
                width: SCREEN_WIDTH,
                height: SCREEN_HEIGHT,
            },
            width: 800,
            height: 600,
            scene: [PreloadGameScene, GameScene],
        };

        const game = new Phaser.Game(config);

        return () => {
            game.destroy(true);
        }
    }, [isWalletConnected]);

    return (
        <div id={elementId}>
        </div>
    );
};

export default GameView;
