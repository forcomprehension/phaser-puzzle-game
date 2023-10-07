import { BaseGameScene } from "./BaseGameScene";
import { addBackgroundImageCover } from "@utils/images";
import { MonochromeDisplayNode } from "@GameObjects/commands/nodes/MonochromeDisplayNode";
import { RandomIntNode } from "@GameObjects/commands/nodes/RandomIntNode";
import { NodeConnectionDrawingTool } from "@GameObjects/commands/NodeConnectorDrawingTool";
import { CustomTextBox } from "@GameObjects/Textbox/CustomTextBox";
import { NODE_RECEIVE_DATA } from "@GameObjects/commands/nodes/events";
import { LevelsManager, levels } from "@src/levels/LevelsManager";
import { MultiplicationNode } from "@GameObjects/commands/nodes/Math/MultiplicationNode";
import { DivisionNode } from "@GameObjects/commands/nodes/Math/DivisionNode";
import { LiteralNode } from "@GameObjects/commands/nodes/LiteralNode";
import { SubtractNode } from "@GameObjects/commands/nodes/Math/SubtractNode";
import { FrameGraph } from "@src/classes/vm/FrameGraph";
import { IfNode } from "@GameObjects/commands/nodes/IfNode";
import { EntryNode } from "@GameObjects/commands/nodes/EntryNode";
import { ReturnNode } from "@GameObjects/commands/nodes/ReturnNode";
import { Interpreter } from "@src/classes/vm/Interpreter";
import { StackFrame } from "@src/classes/vm/StackFrame";
import { CallStack } from "@src/classes/vm/CallStack";
import { CompileButton } from "@GameObjects/ui/CompileButton";
import { GraphProcessor } from "@src/classes/GraphProcessor";
import { CommandNode } from "@GameObjects/commands/nodes/CommandNode";
import { Interpreter3 } from "@src/classes/vm/Interpreter3";

export type ProgrammingSceneData = {
    level?: number
};

const START_INDEX_LEVEL = 2;

export class TestProgrammingScene extends BaseGameScene {

    public enableDashboard: boolean = false;

    public nodeConnectorDrawer: NodeConnectionDrawingTool;

    public readonly frameGraph = new FrameGraph();

    protected readonly interpreter = new Interpreter();

    protected level: number = START_INDEX_LEVEL;

    protected winCurrentLevel: boolean = false;

    protected levelsManager: LevelsManager = new LevelsManager(levels);

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
        });

        const { canvasWidth } = this.getCanvasSize();

        const compileButton = new CompileButton(
            this,
            canvasWidth - 100,
            100
        );
        compileButton.tint = 0x6622AA;

        compileButton.addClickHandler(() => {
            const entryNode = this.children.list.find((gameObject) => gameObject instanceof LiteralNode && gameObject.ourValue === 212);
            if (entryNode instanceof CommandNode) {
                const instructionsList = new GraphProcessor().convertFrom(entryNode);
                const interpreter = new Interpreter3(instructionsList);

                interpreter.continue();
            }
        });

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

        const callStack = new CallStack();
        // callStack.push(new StackFrame())
        this.interpreter.executeStack(callStack);

        const enterNode = new EntryNode(this, 100, canvasHeight / 2);
        // const returnNode = new ReturnNode(this, canvasWidth - 100, canvasHeight / 2);

        const ifNode = new IfNode(this, canvasWidth / 2, canvasHeight / 2);
        const monochromeDisplay = new MonochromeDisplayNode(this, 1450, 600);

        
    }

    protected bootstrap() {
        addBackgroundImageCover(this, 'bg-controlPanel');
    }
}

