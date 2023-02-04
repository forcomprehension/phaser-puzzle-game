import Phaser from 'phaser'
import { GameObjectsScene } from './scenes/GameObjectsScene';
import { LoadingScene } from './scenes/LoadingScene';

new Phaser.Game({
    backgroundColor: 0x3333AA,
    scale: {
        width: 1920,
        height: 1080,
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'matter',
        matter: {
            debug: !!process.env.DEBUG,
        }
    },
    scene:[LoadingScene, GameObjectsScene]
});