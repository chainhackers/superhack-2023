import React, { useEffect } from 'react';
import Phaser from 'phaser';
import GameScene from '../../game/scenes/gameScene';
import PreloadGameScene from '../../game/scenes/preloadGameScene';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../../game/constants/gameConstants';

const GameView: React.FC = () => {
    const elementId: string = 'phaser-game';
    useEffect(() => {
        const backgroundColor = "#2bc48a";

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
    }, []);

    return (
        <div id={elementId}>
        </div>
    );
};

export default GameView;
