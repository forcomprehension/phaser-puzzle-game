import { GameObjectDuplexConnector } from "@src/classes/GameObjectsDuplexConnector";
import { BaseGameScene } from "@src/scenes/BaseGameScene";

/**
 * DrivingBelt game object
 */
export class DrivingBelt extends Phaser.GameObjects.Graphics {

    /**
     * DrivingBelt line width
     */
    public static readonly LINE_WIDTH = 10;

    /**
     * Hit zone width multiplier. Multiplied by LINE_WIDTH
     */
    public static readonly HIT_ZONE_WIDTH_MULTIPLIER = 3.5;

    /**
     * When we point to zone, it may be cover other objects
     *
     * @TODO: May be fixed with other input type?
     */
    public static readonly HALF_SUBTRACT_FROM_ZONE_LENGTH = 50;

    /**
     * Default color for DrivingBelt
     */
    public static readonly DEFAULT_COLOR = 0xDD9900;

    /**
     * Default color for hover
     */
    public static readonly HOVER_COLOR = 0x3366DD;

    /**
     * Update tween
     */
    protected tween: Phaser.Tweens.Tween;

    /**
     * Hit zone
     */
    protected hitZone: Phaser.GameObjects.Zone;

    /**
     * Mark dirty if we need an extra update
     */
    protected dirty: boolean = false;

    /**
     * Ctor
     */
    constructor(
        public scene: BaseGameScene,
        protected connector: GameObjectDuplexConnector
    ) {
        super(scene, {
            lineStyle: {
                width: DrivingBelt.LINE_WIDTH,
                color: DrivingBelt.DEFAULT_COLOR,
                alpha: 1,
            }
        });

        scene.add.existing(this);

        this.hitZone = scene.add.zone(this.x, this.y, DrivingBelt.LINE_WIDTH, DrivingBelt.LINE_WIDTH);

        this.hitZone.setInteractive();
        this.hitZone.on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, this.onPointerEnter, this);
        this.hitZone.on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, this.onPointerLeave, this);
        this.hitZone.on(Phaser.Input.Events.POINTER_UP, this.onClick, this);

        this.runUpdate();
    }

    protected onClick() {
        if (this.scene.hasActiveGameObject()) { // @TODO: check that object is not driving belt?
            return;
        }

        this.scene.activateGameObject(this.scene.drivingBeltDrawer);
        this.connector.disconnect();
        this.scene.drivingBeltDrawer.returnBelt();
        this.destroy();
    }

    protected onPointerEnter() {
        if (this.scene.hasActiveGameObject()) {
            // @TODO: HOW TO HANDLE OBJECT DEACTIVATION?
            return;
        }
        this.setDefaultStyles({
            lineStyle: {
                width: DrivingBelt.LINE_WIDTH,
                color: DrivingBelt.HOVER_COLOR
            }
        })
        this.setDirty(true);
    }

    protected onPointerLeave() {
        this.setDefaultStyles({
            lineStyle: {
                width: DrivingBelt.LINE_WIDTH,
                color: DrivingBelt.DEFAULT_COLOR
            }
        })
        this.setDirty(true);
    }

    /**
     * Forcing rerender of DrivingBelt
     *
     * @param isDirty
     */
    protected setDirty(isDirty: boolean) {
        this.dirty = isDirty;
    }

    /**
     * Start updater
     */
    protected runUpdate() {
        const lastCoordsFrom = new Phaser.Math.Vector2();
        const lastCoordsTo = new Phaser.Math.Vector2();
        const currentCoordsFrom = new Phaser.Math.Vector2();
        const currentCoordsTo = new Phaser.Math.Vector2();

        this.tween = this.scene.tweens.addCounter({
            loop: -1,
            useFrames: true,
            duration: 1,
            onUpdate: () => {
                const coordsFrom = currentCoordsFrom.copy(this.connector.getFirstConnector().getSocketLocation());
                const coordsTo = currentCoordsTo.copy(this.connector.getSecondConnector().getSocketLocation());

                if (this.dirty || !lastCoordsFrom.equals(coordsFrom) || !lastCoordsTo.equals(coordsTo)) {
                    // Get center of the line
                    const centerPosition = coordsFrom.clone()
                        .subtract(coordsTo)
                        .divide({ x: 2, y: 2 })
                        .add(coordsTo);

                    // Get current angle
                    const diffVector = coordsTo.clone().subtract(coordsFrom);
                    const angle = diffVector.angle();
                    const magnitude = diffVector.length();

                    this.hitZone.setRotation(angle);
                    this.hitZone.setPosition(centerPosition.x, centerPosition.y);
                    this.hitZone.setSize( // @TODO: calculate from half-sizes
                        Math.max(10, magnitude - DrivingBelt.HALF_SUBTRACT_FROM_ZONE_LENGTH * 2),
                        DrivingBelt.LINE_WIDTH * DrivingBelt.HIT_ZONE_WIDTH_MULTIPLIER,
                        true
                    );

                    this.clear();
                    this.lineBetween(
                        coordsFrom.x,
                        coordsFrom.y,
                        coordsTo.x,
                        coordsTo.y
                    );

                    this.setDirty(false);
                }

                lastCoordsFrom.setFromObject(coordsFrom);
                lastCoordsTo.setFromObject(coordsTo);
            }
        });
    }

    public destroy(fromScene?: boolean | undefined): void {
        this.clear();
        super.destroy(fromScene);
        this.hitZone.destroy(fromScene);

        this.tween.remove();

        // @ts-ignore
        this.hitZone = this.tween = null;
    }
}
