import { BaseGameScene } from "./BaseGameScene";
import { addBackgroundImageCover } from "@utils/images";
import { NodeConnectionDrawingTool } from "@GameObjects/commands/NodeConnectorDrawingTool";
import { CustomTextBox } from "@GameObjects/Textbox/CustomTextBox";
import { LevelsManager } from "@src/levels/LevelsManager";
import { FrameGraph } from "@src/classes/vm/FrameGraph";
import { EntryNode } from "@GameObjects/commands/nodes/EntryNode";
import { CompileButton } from "@GameObjects/ui/CompileButton";
import { GraphProcessor } from "@src/classes/GraphProcessor";
import { CommandNode } from "@GameObjects/commands/nodes/CommandNode";
import { Interpreter3 } from "@src/classes/vm/Interpreter3";
import { levels } from "@src/levels/levelsList";
import { ActorKey, ActorsService } from "@src/services/ActorsService";
import type { Label, RoundRectangle } from "phaser3-rex-plugins/templates/ui/ui-components";

export type ProgrammingSceneData = {
    level?: number
};

const START_INDEX_LEVEL = 0;

export class TestProgrammingScene extends BaseGameScene {

    public enableDashboard: boolean = false;

    public nodeConnectorDrawer: NodeConnectionDrawingTool;

    public readonly frameGraph = new FrameGraph();

    protected level: number = START_INDEX_LEVEL;

    protected winCurrentLevel: boolean = false;

    protected sceneActionsZone: Phaser.GameObjects.Zone;

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
            const entryNode = this.levelsManager.firstActorOfCurrentLevel;
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
        const enterNode = new EntryNode(this, 100, canvasHeight / 2);
    }

    protected bootstrap() {
        const { canvasHeight, canvasWidth } = this.getCanvasSize();
        addBackgroundImageCover(this, 'bg-controlPanel');

        this.sceneActionsZone = this.add.zone(0, 0, canvasWidth, canvasHeight)
            .setInteractive()
            .on(Phaser.Input.Events.POINTER_UP, (pointer: Phaser.Input.Pointer) => {
                if (!pointer.rightButtonReleased()) {
                    return;
                }

                const menu = this.rexUI.add.menu({
                    x: pointer.x,
                    y: pointer.y,
                    orientation: 'y',
                    items: [{
                        name: 'Add',
                        children: Object.keys(ActorsService.getInstance().actorsMap).map((actorKey: string) => ({
                            name: actorKey,
                            isSpawner: true,
                        })),
                    }],
                    createButtonCallback: (item) => {
                        const label = this.rexUI.add.label({
                            background: this.rexUI.add.roundRectangle(0, 0, 2, 2, 0, CustomTextBox.BG_COLOR),
                            text: this.add.text(0, 0, item.name, {
                                fontSize: '20px'
                            }),
                            icon: this.rexUI.add.roundRectangle(0, 0, 0, 0, 10, CustomTextBox.STROKE_STYLE),
                            space: {
                                left: 10,
                                right: 10,
                                top: 10,
                                bottom: 10,
                                icon: 10
                            }
                        });

                        if (item.isSpawner) {
                            label.setData('actor', item.name);
                        }

                        return label;
                    }
                }).on('button.click', (button: Label) => {
                    const actorName: ActorKey | undefined = button.data?.get('actor');

                    if (actorName) {
                        ActorsService.getInstance().getActorSpawner(actorName, menu.x, menu.y)(this)
                        menu.destroy();
                    }
                }).on('button.out', (button: Label) => {
                    (button.getElement('background') as RoundRectangle).fillColor = CustomTextBox.BG_COLOR
                }).on('button.over', (button: Label) => {
                    (button.getElement('background') as RoundRectangle).fillColor = CustomTextBox.BG_COLOR - 0x444444
                })
            });
    }
}

