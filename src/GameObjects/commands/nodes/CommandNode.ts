import { DEFAULT_NODE_COLOR } from "@src/constants/colors";
import { NodePin } from "../NodePin";
import type { TestProgrammingScene } from "@src/scenes/TestProgrammingScene";
import { ON_PIN_CONNECTED, ON_PIN_DISCONNECTED } from "../nodepins/events";
import { INodeReceiveData } from "@interfaces/nodes/INodeReceiveData";
import { NODE_RECEIVE_DATA } from "./events";

type MainComponent = Phaser.GameObjects.GameObject & Phaser.GameObjects.Components.Origin & {
    height: number,
    width: number,
};

export type BaseComponentsFactoryResult = {
    list: Array<Phaser.GameObjects.GameObject>;
    mainComponent: MainComponent;
}


/**
 * Base command node
 */
export class CommandNode extends Phaser.GameObjects.Container implements INodeReceiveData {
    /**
     * Pin vertical margin
     */
    public static readonly MIN_PIN_OFFSET = 20;

    /**
     * Use pin size size as its height, because it has square bounds
     */
    public static readonly PIN_SIDE_SIZE = NodePin.HEIGHT;

    /**
     * Calculates pin offset
     *
     * @param index
     * @param offsetTop
     */
    public static calculateVerticalPinOffset(index: number, offsetTop: number) {
        return index * this.PIN_SIDE_SIZE // Count of pins
            + offsetTop // + offsetTop, which is mainComp height multiplied by originY
            + (.5 * this.PIN_SIDE_SIZE) // @TODO: get original nodepin originY
            + index + 1 * this.MIN_PIN_OFFSET; // Always add top offset
    }

    /**
     * Partial factory
     */
    public static spawnerFactory(
        x: number,
        y: number,
        isDraggable: boolean = true
    ) {
        const ctor = this;
        return function LevelFactory(scene: TestProgrammingScene) {
            return new ctor(scene, x, y, isDraggable);
        }
    }

    /**
     * @deprecated
     * @see realWidth
     */
    public width: number;

    /**
     * @deprecated
     * @see realHeight
     */
    public height: number;

    /**
     * Real container width
     */
    public get realWidth() {
        // @TODO: Scale?
        return this.mainComponent?.width || this.width;
    }

    /**
     * Real container height
     */
    public get realHeight() {
        return this.mainComponent?.height || this.height;
    }

    /**
     * Right pins container
     */
    protected readonly rightPinsList: NodePin[] = [];

    /**
     * Left pins container
     */
    protected readonly leftPinsList: NodePin[] = [];

    /**
     * Respect relative drag offset
     */
    protected readonly dragOffset: Vector2Like = {
        x: 0,
        y: 0
    };

    /**
     * Main component pointer
     */
    protected mainComponent: Optional<MainComponent>;

    /**
     * Text component pointer
     */
    protected textComponent: Optional<Phaser.GameObjects.Text>;

    /**
     * Ctor
     *
     * @inner
     * @final
     */
    constructor(
        public scene: TestProgrammingScene,
        x: number,
        y: number,
        protected isDraggable: boolean = true,
    ) {
        super(scene, x, y);

        const {
            list,
            mainComponent,
        } = this.createBaseComponents();
        this.mainComponent = mainComponent;
        this.add(list);

        if (this.isDraggable) {
            const { width, height } = mainComponent;
            const zone = this.createZone(width, height);
            this.add(zone);
        }

        // @TODO:
        this.setSize(200, 75);
        this.once(Phaser.GameObjects.Events.ADDED_TO_SCENE, () => {
            // Order is important!
            this.addPins(true, this.getLeftPins());
            this.addPins(false, this.getRightPins());
        });

        this.init();

        scene.add.existing(this);
    }

    // region INodeReceiveData
    /**
     * Can this node receive data
     */
    public canReceiveData(): boolean {
        return this.leftPinsList.length > 0;
    }

    /**
     * Receive data marker
     */
    public receiveData(senderPin: NodePin, data: any, receiverPin: NodePin): void {
        this.emit(NODE_RECEIVE_DATA, senderPin, data, receiverPin);
    }
    // endregion INodeReceiveData

    /**
     * Aux initializer
     */
    protected init(): this {
        return this;
    }

    /**
     * Sets extra data for actor with validation
     */
    public setDataWithValidation(...args: any[]): boolean {
        return true;
    }

    /**
     * Add pins to this node
     */
    public addPins(isLeft: boolean, pins: NodePin[]) {
        const mainComponentWidth = this.realWidth;
        const mainComponentHeight = this.realHeight;
        const mainComponentOriginY = this.mainComponent?.originY || 0;

        const pinsLength = pins.length;
        const needHeight = pinsLength *
            CommandNode.PIN_SIDE_SIZE + CommandNode.MIN_PIN_OFFSET // Calculate Height + bottom offset
            CommandNode.MIN_PIN_OFFSET; // Top offset

        if (this.mainComponent && mainComponentHeight < needHeight) {
            this.mainComponent.height = needHeight;
        }

        const alignedPins: NodePin[] = [];
        const originOffset = mainComponentHeight * mainComponentOriginY * -1;
        for (let i = 0; i < pinsLength; i++) {
            if (pins[i]) {
                pins[i].setY(CommandNode.calculateVerticalPinOffset(i, originOffset));
                pins[i].setX(
                     // @TODO: Which origin gave .5?
                    (mainComponentWidth / 2 - CommandNode.PIN_SIDE_SIZE * .5) * (isLeft ? -1 : 1)
                );

                this.scene.add.existing(pins[i]);
                alignedPins.push(pins[i]);

                // Forward ON_PIN_CONNECTED from NodePin to this
                const forwardMessage = function forwardMessage(this: CommandNode, ...args: any[]) {
                    this.emit(ON_PIN_CONNECTED, ...args);
                };
                pins[i].on(ON_PIN_CONNECTED, forwardMessage, this);
                pins[i].once(ON_PIN_DISCONNECTED, () => {
                    this.emit(ON_PIN_DISCONNECTED, pins[i]);
                });
                pins[i].off(ON_PIN_DISCONNECTED, forwardMessage, this);
            }
        }

        this.add(alignedPins);

        if (isLeft) {
            this.leftPinsList.push(...alignedPins);
        } else {
            this.rightPinsList.push(...alignedPins);
        }
    }

    protected getLeftPins(): NodePin[] {
        return [];
    }

    protected getRightPins(): NodePin[]  {
        return [];
    }

    /**
     * Zone start drag handler
     */
    protected onDragStart() {
        this.dragOffset.x = this.scene.input.mousePointer.x - this.x;
        this.dragOffset.y = this.scene.input.mousePointer.y - this.y;
    }

    /**
     * Zone drag handler
     *
     * @param pointer
     */
    protected onDrag(pointer: Phaser.Input.Pointer) {
        const { canvasHeight, canvasWidth } = this.scene.getCanvasSize();

        // Clamp to display
        const newX = Phaser.Math.Clamp(pointer.x - this.dragOffset.x, 2, canvasWidth - 2);
        const newY = Phaser.Math.Clamp(pointer.y - this.dragOffset.y, 2, canvasHeight - 2);

        this.setPosition(newX, newY);
    }

    /**
     * Create dragging zone
     *
     * @param width
     * @param height
     */
    public createZone(width: number, height: number) {
        const zone = this.scene.add.zone(0, 0, width, height);
        zone.setInteractive({
            useHandCursor: true,
            draggable: true,
        });

        zone.on(Phaser.Input.Events.DRAG_START, this.onDragStart, this);
        zone.on(Phaser.Input.Events.DRAG, this.onDrag, this);

        return zone;
    }

    protected getTextNode() {
        return 'Node()';
    }

    /**
     * Create base components needed for each command node
     */
    protected createBaseComponents(): BaseComponentsFactoryResult {
        const rect = this.scene.add.rectangle(
            0,
            0,
            200,
            75,
            DEFAULT_NODE_COLOR,
        );

        const text = this.textComponent = this.scene.add.text(
            0,
            0,
            this.getTextNode(),
            {
                fontSize: '36px',
                color: 'white',
                fontFamily: 'RobotoRegular'
            }
        ).setOrigin(.5);

        const textWidth = text.getBounds().width;

        if (rect.width < textWidth) {
            rect.width = textWidth;
        }

        return {
            list: [
                rect,
                text
            ],
            mainComponent: rect
        };
    }

    public destroy(fromScene?: boolean | undefined): void {
        this.mainComponent = undefined;

        super.destroy(fromScene);
    }
}
