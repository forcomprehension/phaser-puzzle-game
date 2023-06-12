import Phaser from 'phaser'
import { TestProgrammingScene } from './scenes/TestProgrammingScene';
import { LoadingScene } from './scenes/LoadingScene';

// Plugins
import UIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';
import DragPlugin from 'phaser3-rex-plugins/plugins/drag-plugin.js';
// @ts-ignore
import RoundRectanglePlugin from 'phaser3-rex-plugins/plugins/roundrectangle-plugin.js';
import MainMenu from './scenes/MainMenu';

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
            // @ts-ignore
            timing: {
                timeScale: 1
            }
        }
    },
    scene:[LoadingScene, TestProgrammingScene, MainMenu],
    plugins: {
        global: [{
            key: 'rexDrag',
            plugin: DragPlugin,
            start: true
        }, {
            key: 'rexRoundRectangleCanvasPlugin',
            plugin: RoundRectanglePlugin,
            start: true
        }],
        scene: [{
            key: 'rexUI',
            plugin: UIPlugin,
            mapping: 'rexUI'
        }]
    }
});