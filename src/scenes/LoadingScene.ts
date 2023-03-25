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
        this.load.image('6x6', 'assets/motors/6x6.png');
        this.load.image('ropeIcon', 'assets/toolsIcons/ropeIcon.png');
    }

    public create() {
        const index = this.scene.getIndex();
        const nextScene = this.scene.manager.scenes[index + 1];

        this.scene.start(nextScene.scene.key);
    }
}