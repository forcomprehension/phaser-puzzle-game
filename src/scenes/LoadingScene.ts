import { LOADING_SCENE } from "../constants/scenes";

/**
 * Loading scene for entire game
 */
export class LoadingScene extends Phaser.Scene {
    constructor() {
        super(LOADING_SCENE);
    }

    public preload() {
        this.load.image("ball-124", "assets/balls/ball-124.png");
        this.load.image("basketball-ball", "assets/balls/basketball-ball.png");
        this.load.image("football-ball", "assets/balls/football-ball.png");
        this.load.image("bowling-ball", "assets/balls/bowling-ball.png");
        this.load.image("eight-ball", "assets/balls/8-ball.png");
        this.load.image("gear-12", "assets/gears/gear-12.png");
        this.load.image("gear-6", "assets/gears/gear-6.png");
        this.load.atlas('motor', 'assets/motors/motor.png', 'assets/motors/motor.json');
        this.load.atlas('cannon', 'assets/cannon/cannon.png', 'assets/cannon/cannon.json');
        this.load.json('cannon-body', 'assets/cannon/cannon-matterjs.json');
        this.load.spritesheet(
            'anti-gravity-pad',
            'assets/antigravity/anti-gravity-pad.png',
            { frameWidth: 158, frameHeight: 56 }
        );
        this.load.image('drivingBeltIcon', 'assets/toolsIcons/drivingBeltIcon.png');
        this.load.image('flatWoodBlock', 'assets/blocks/wood/flat_block.png');
        this.load.image('flatMetalBlock', 'assets/blocks/metal/flat_block.png');

        // BG
        this.load.image('bg', ['assets/common/bg/mars-background.webp', 'assets/common/bg/mars-background_n.webp']);
        this.load.image('bg-controlPanel', 'assets/common/bg/bg-ControlPanel.png');

        // UI
        this.load.image('icon-rotate', 'assets/ui/icons/sync.png');

        // Characters
        this.load.atlas(
            'tom',
            'assets/characters/tom/tom-walk.png',
            'assets/characters/tom/tom-walk.json',
        );
    }

    public create() {
        const index = this.scene.getIndex();
        const nextScene = this.scene.manager.scenes[index + 1];

        this.scene.start(nextScene.scene.key);
    }
}