import { BaseGameScene } from "./BaseGameScene";
import { addBackgroundImageCover } from "@utils/images";
import { MonochromeDisplayNode } from "@GameObjects/commands/nodes/MonochromeDisplayNode";
import { RandomIntNode } from "@GameObjects/commands/nodes/RandomIntNode";
import { NodeConnectionDrawingTool } from "@GameObjects/commands/NodeConnectorDrawingTool";
import { CustomTextBox } from "@GameObjects/Textbox/CustomTextBox";
import { NODE_RECEIVE_DATA } from "@GameObjects/commands/nodes/events";
import { LevelsManager, level1 } from "@src/levels/LevelsManager";
import { MultiplicationNode } from "@GameObjects/commands/nodes/Math/MultiplicationNode";
import { DivisionNode } from "@GameObjects/commands/nodes/Math/DivisionNode";
import { VarNode } from "@GameObjects/commands/nodes/VarNode";
import { SubtractNode } from "@GameObjects/commands/nodes/Math/SubtractNode";

export type ProgrammingSceneData = {
    level?: number
};

const START_INDEX_LEVEL = 0;

export class TestProgrammingScene extends BaseGameScene {

    public enableDashboard: boolean = false;

    public nodeConnectorDrawer: NodeConnectionDrawingTool;

    protected level: number = START_INDEX_LEVEL;

    protected levelsManager: LevelsManager = new LevelsManager([level1]);

    constructor() {
        super('ProgrammingScene');
    }

    /**
     * Determine current level
     */
    public init(data: ProgrammingSceneData) {
        this.level = typeof data.level === 'undefined' ? START_INDEX_LEVEL : data.level;
    }

    public create() {
        super.create();
        this.bootstrap();

        this.nodeConnectorDrawer = new NodeConnectionDrawingTool(this);
        // Shutdown
        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            this.nodeConnectorDrawer.deactivateTool();
            if (this.hasActiveGameObject()) {
                this.deactivateGameObject(this.currentActiveObject!);
            }
        });
        // Destroy
        this.events.once(Phaser.Scenes.Events.DESTROY, () => {
            // @ts-ignore
            this.nodeConnectorDrawer = undefined;
        })

        /**
         * @TODO: CHECK Y SECOND LEVEL DISPLAY DOESN'T GET INFO
         */
        const level = this.levelsManager.getLevel(this.level);
        if (level) {
            this.levelsManager.loadLevel(this, level, this.win);
            return;
        }

        this.testLevel();
    }

    protected win() {
        const { canvasHeight, canvasWidth } = this.getCanvasSize();
        new CustomTextBox(
            this,
            canvasWidth / 2,
            canvasHeight / 10 * 9,
            () => {
                const nextLevelIndex = this.level + 1;
                if (this.levelsManager.hasNextLevel(nextLevelIndex)) {
                    this.scene.restart({
                        level: nextLevelIndex
                    })
                } else {
                    alert('You won!');
                }
            }
        ).start('Well done!\nProceed to next level!');
    }

    protected testLevel() {
        const { canvasHeight } = this.getCanvasSize();
        const monochromeDisplay = new MonochromeDisplayNode(this, 1480, 360);
        const randomIntInput = new RandomIntNode(this, 0, 0, false);
        new MultiplicationNode(this, 650, 350);
        new SubtractNode(this, 650, 950);
        new DivisionNode(this, 650, 500);
        new VarNode(this, 150, 800).setVar(9);
        new VarNode(this, 450, 800).setVar(5);
        new VarNode(this, 700, 800).setVar(32);
        // @TODO: MOVE TO ARGUMENTS
        // Dock to left
        randomIntInput.setPosition(
            randomIntInput.realWidth * randomIntInput.originX,
            canvasHeight / 2 - randomIntInput.realHeight * randomIntInput.originY
        );

        monochromeDisplay.once(NODE_RECEIVE_DATA, this.win, this);
    }

    protected bootstrap() {
        addBackgroundImageCover(this, 'bg-controlPanel');
    }
}

