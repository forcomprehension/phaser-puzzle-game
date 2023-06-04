import type { BaseGameScene } from "@src/scenes/BaseGameScene";

/**
 * Base command node
 */
export class CommandNode extends Phaser.GameObjects.Container {

    /**
     * Respect relative drag offset
     */
    protected readonly dragOffset: Vector2Like = {
        x: 0,
        y: 0
    };

    /**
     * Ctor
     */
    constructor(
        scene: BaseGameScene,
        x: number,
        y: number
    ) {
        super(scene, x, y);

        this.add(this.createBaseComponents());
        this.setSize(200, 75);
        scene.add.existing(this);

        const zone = this.list.find((gameObject) => gameObject instanceof Phaser.GameObjects.Zone);
        if (zone) {
            zone.setInteractive({
                useHandCursor: true,
                draggable: true,
            });

            zone.on(Phaser.Input.Events.DRAG_START, this.onDragStart, this);
            zone.on(Phaser.Input.Events.DRAG, this.onDrag, this);
        }
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
        this.setPosition(
            pointer.x - this.dragOffset.x,
            pointer.y - this.dragOffset.y
        );
    }

    /**
     * Create base components needed for each command node
     */
    protected createBaseComponents(): Phaser.GameObjects.GameObject[] {
        const rect = this.scene.add.rectangle(
            0,
            0,
            200,
            75,
            Phaser.Display.Color.GetColor(0x33, 0x33, 0x33)
        );

        const text = this.scene.add.text(
            0,
            0,
            'Node()',
            {
                fontSize: '36px',
                color: 'yellow'
            }
        ).setOrigin(.5);

        const textWidth = text.getBounds().width;

        if (rect.width < textWidth) {
            rect.width = textWidth;
        }

        const zone = this.scene.add.zone(0, 0, rect.width, rect.height);

        return [
            zone,
            rect,
            text
        ];
    }
}
