import { BaseGameScene } from "./BaseGameScene";
import { addBackgroundImageCover } from "@utils/images";
import { MonochromeDisplayNode } from "@GameObjects/commands/nodes/MonochromeDisplayNode";
import { RandomIntNode } from "@GameObjects/commands/nodes/RandomIntNode";
import { NodeConnectionDrawingTool } from "@GameObjects/commands/NodeConnectorDrawingTool";
import { CustomTextBox } from "@GameObjects/Textbox/CustomTextBox";
import { NODE_RECEIVE_DATA } from "@GameObjects/commands/nodes/events";
import { LevelsManager, level1, level2 } from "@src/levels/LevelsManager";
import { MultiplicationNode } from "@GameObjects/commands/nodes/Math/MultiplicationNode";
import { DivisionNode } from "@GameObjects/commands/nodes/Math/DivisionNode";
import { VarNode } from "@GameObjects/commands/nodes/VarNode";
import { SubtractNode } from "@GameObjects/commands/nodes/Math/SubtractNode";
import { FrameGraph } from "@GameObjects/vm/FrameGraph";
import { IfNode } from "@GameObjects/commands/nodes/IfNode";
import { EnterNode } from "@GameObjects/commands/nodes/EnterNode";
import { ReturnNode } from "@GameObjects/commands/nodes/ReturnNode";

export type ProgrammingSceneData = {
    level?: number
};

const START_INDEX_LEVEL = -1;

export class TestProgrammingScene extends BaseGameScene {

    public enableDashboard: boolean = false;

    public nodeConnectorDrawer: NodeConnectionDrawingTool;

    public readonly frameGraph = new FrameGraph();

    protected level: number = START_INDEX_LEVEL;

    protected winCurrentLevel: boolean = false;

    protected levelsManager: LevelsManager = new LevelsManager([level2, level1]);

    constructor() {
        super('ProgrammingScene');
    }

    /**
     * Determine current level
     */
    public init(data: ProgrammingSceneData) {
        this.winCurrentLevel = false;
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

        const level = this.levelsManager.getLevel(this.level);
        if (level) {
            this.levelsManager.loadLevel(this, level, this.win);
            return;
        }

        this.testLevel();
    }

    protected win() {
        // @todo: do better condition
        if (!this.winCurrentLevel) {
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

            this.winCurrentLevel = true;
        }
    }

    protected testLevel() {
        const { canvasHeight, canvasWidth } = this.getCanvasSize();

        const enterNode = new EnterNode(this, 100, canvasHeight / 2);
        // const returnNode = new ReturnNode(this, canvasWidth - 100, canvasHeight / 2);

        const ifNode = new IfNode(this, canvasWidth / 2, canvasHeight / 2);
        const monochromeDisplay = new MonochromeDisplayNode(this, 1450, 600);
    }

    protected bootstrap() {
        addBackgroundImageCover(this, 'bg-controlPanel');
    }
}

