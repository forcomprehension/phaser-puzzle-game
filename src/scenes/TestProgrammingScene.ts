import { CommandNode } from "@GameObjects/commands/nodes/CommandNode";
import { BaseGameScene } from "./BaseGameScene";
import { addBackgroundImageCover } from "@utils/images";
import { MonochromeDisplayNode } from "@GameObjects/commands/nodes/MonochromeDisplayNode";
import { RandomIntNode } from "@GameObjects/commands/nodes/RandomIntNode";

export class TestProgrammingScene extends BaseGameScene {

    public enableDashboard: boolean = false;

    constructor() {
        super('ProgrammingScene');
    }

    public create() {
        super.create();
        this.bootstrap();

        const { canvasHeight } = this.getCanvasSize();

        new CommandNode(this, 200, 300);
        new CommandNode(this, 400, 500);
        new MonochromeDisplayNode(this, 1480, 360);
        const randomIntInput = new RandomIntNode(this, 0, 0, false).init();
        // Dock to left
        randomIntInput.setPosition(
            randomIntInput.realWidth * randomIntInput.originX,
            canvasHeight / 2 - randomIntInput.realHeight * randomIntInput.originY
        );
    }

    protected bootstrap() {
        addBackgroundImageCover(this, 'bg-controlPanel');
    }
}

