import Phaser from 'phaser'
import { GameObjectsScene } from './scenes/GameObjectsScene';
import { LoadingScene } from './scenes/LoadingScene';

// Plugins
import UIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';

new Phaser.Game({
    backgroundColor: 0x3333AA,
    type: Phaser.WEBGL,
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
    scene:[LoadingScene, GameObjectsScene],
    plugins: {
        scene: [{
            key: 'rexUI',
            plugin: UIPlugin,
            mapping: 'rexUI'
        }]
    }
});