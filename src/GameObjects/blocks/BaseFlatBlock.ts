import { FlatBlockDashboardPresenter } from "@GameObjects/ToolsDashboard/dashboardPresenters/FlatBlockDashboardPresenter";
import type { BaseGameScene } from "@src/scenes/BaseGameScene";
import { FlatBlockSpawnerType } from "./Spawners/flatBlockSpawnerType";
import DragPlugin from 'phaser3-rex-plugins/plugins/drag-plugin'
import { getMatterBody } from "@src/physics/matter";

/**
 * Base class for all substance flat blocks
 */
export class BaseFlatBlock extends Phaser.GameObjects.TileSprite {

    public static readonly MIN_SIZE = 120;
    public static readonly MAX_SIZE = 500;

    public static readonly RESIZE_ZONE_SIZE_X = 50;
    public static readonly RESIZE_ZONE_SIZE_Y = 75;

    public static readonly ROTATION_STEP = 30;

    protected leftZone: Phaser.GameObjects.Zone;
    protected rightZone: Phaser.GameObjects.Zone;

    protected rotator: Phaser.GameObjects.Image;

    /**
     * Update this object after physics update
     */
    protected resizeTileAfterPhysics: boolean = false;

    /**
     * Ctor
     */
    constructor(
        public scene: BaseGameScene,
        x: number,
        y: number,
        textureKey: string,
        public readonly spawnerType: FlatBlockSpawnerType,
        width: number = 0,
    ) {
        const tex = scene.textures.get(textureKey);
        const frame = tex.get(tex.firstFrame);

        super(
            scene,
            x,
            y,
            width > 0 ? width : frame.width,
            frame.height,
            tex.key
        );

        scene.matter.add.gameObject(this, {
            ignoreGravity: true,
            isStatic: true,
        });

        this.setInteractive()
            .on(Phaser.Input.Events.POINTER_DOWN, (pointer: Phaser.Input.Pointer) => {
                if (pointer.rightButtonDown()) {
                    this.handleReturn();
                }
            });

        this.setupResize();
        this.setupRotator();

        // AfterUpdate hook
        this.scene.matter.world
            .on(Phaser.Physics.Matter.Events.AFTER_UPDATE, this.handleAfterPhysics, this);


        scene.add.existing(this);
    }

    /**
     * Setup Rotator Element
     */
    protected setupRotator() {
        this.rotator = this.scene.add.image(this.x, this.y, 'icon-rotate')
            .setScale(2);
        this.rotator.setInteractive({
            useHandCursor: true
        }).on(Phaser.Input.Events.POINTER_DOWN, () => {
            const nextAngle = this.angle + BaseFlatBlock.ROTATION_STEP;
            const zones = [this.leftZone, this.rightZone];

            this.setAngle(nextAngle);

            Phaser.Actions.SetRotation(zones, Phaser.Math.DegToRad(nextAngle));
            Phaser.Actions.RotateAround(
                zones,
                { x: this.x, y: this.y },
                Phaser.Math.DegToRad(BaseFlatBlock.ROTATION_STEP),
            );

        }).setDepth(1);
    }

    /**
     * Handling object resize
     */
    protected setupResize() {
        this.leftZone = this.scene.add.zone(
            this.x - this.width / 2,
            this.y,
            BaseFlatBlock.RESIZE_ZONE_SIZE_X,
            BaseFlatBlock.RESIZE_ZONE_SIZE_Y
        ).setInteractive({
            draggable: true,
            useHandCursor: true,
        });

        this.rightZone = this.scene.add.zone(
            this.x + this.width / 2,
            this.y,
            BaseFlatBlock.RESIZE_ZONE_SIZE_X,
            BaseFlatBlock.RESIZE_ZONE_SIZE_Y
        ).setInteractive({
            draggable: true,
            useHandCursor: true,
        });

        const dragPlugin = this.scene.plugins.get('rexDrag') as DragPlugin;

        [this.leftZone, this.rightZone].forEach((currentZone) => {
            // @TODO: doesn't need to remove?
            dragPlugin.add(currentZone, {
                enable: true,
                axis: 'h'
            });

            // Get matter body for vertices update
            const body = getMatterBody(this);

            currentZone.on(Phaser.Input.Events.DRAG, (_: Phaser.Input.Pointer, dragX: number) => {
                if (body?.vertices) {
                    const [ leftTop, rightTop ] = body.vertices;

                    if (currentZone === this.leftZone) {
                        const leftTopVec = new Phaser.Math.Vector2({ x: dragX, y: leftTop.y });
                        const vecLength = leftTopVec.distance(rightTop);

                        if (vecLength >= BaseFlatBlock.MIN_SIZE && vecLength <= BaseFlatBlock.MAX_SIZE) {
                            const scaleSize = (rightTop.x - dragX) / (rightTop.x - leftTop.x);
                            this.scene.matter.body.scale(body, scaleSize, 1, rightTop);

                            const intersected = this.scene.matter.intersectBody(body);
                            if (intersected.length) {
                                this.scene.matter.body.scale(body, 1 / scaleSize, 1, rightTop);
                            }

                            this.resizeTileAfterPhysics = true;
                        }
                    } else {
                        const newRightTopVec = new Phaser.Math.Vector2({ x: dragX, y: rightTop.y });
                        const vecLength = newRightTopVec.distance(leftTop);

                        if (vecLength >= BaseFlatBlock.MIN_SIZE && vecLength <= BaseFlatBlock.MAX_SIZE) {
                            const scaleSize = (dragX - leftTop.x) / (rightTop.x - leftTop.x)
                            this.scene.matter.body.scale(body, scaleSize, 1, leftTop);

                            const intersected = this.scene.matter.intersectBody(body);
                            if (intersected.length) {
                                this.scene.matter.body.scale(body, 1 / scaleSize, 1, leftTop);
                            }

                            this.resizeTileAfterPhysics = true;
                        }
                    }
                }
            });
        });
    }


    /**
     * Weld zones to body sides
     */
    protected handleAfterPhysics() {
        const body = getMatterBody(this);
        if (body?.vertices) {
            const [ leftTop, rightTop ] = body.vertices;
            const width = new Phaser.Math.Vector2(leftTop).distance(rightTop);

            if (!(body.position.x === this.rotator.x && body.position.y === this.rotator.y)) {
                // Sets position to zero, then rotate
                this.leftZone.setPosition(body.position.x - width / 2, body.position.y);
                this.rightZone.setPosition(body.position.x + width / 2, body.position.y);
                this.rotator.setPosition(body.position.x, body.position.y);

                Phaser.Actions.RotateAround(
                    [this.leftZone, this.rightZone],
                    { x: this.x, y: this.y },
                    - this.rotation,
                )
            }

            // Update tile
            if (this.resizeTileAfterPhysics) {
                this.width = width;

                this.resizeTileAfterPhysics = false;
            }
        }
    }

    /**
     * Handle return this to dashboard presenter stack
     */
    protected handleReturn() {
        this.scene.toolsDashboard
            .get(FlatBlockDashboardPresenter.name + '|' + this.spawnerType)
            .returnObject(this);

        this.destroy();
    }

    /**
     * Dtor
     *
     * @param fromScene
     */
    public destroy(fromScene?: boolean | undefined): void {
        this.scene.matter.world.remove(this.body);
        this.leftZone.destroy(fromScene);
        this.rightZone.destroy(fromScene);
        this.rotator.destroy(fromScene);
        this.off(Phaser.Input.Events.POINTER_DOWN);
        this.off(Phaser.Physics.Matter.Events.AFTER_UPDATE, this.handleAfterPhysics);

        super.destroy(fromScene);

        // @ts-ignore
        this.rotator = this.leftZone = this.rightZone = this.body = null;
    }
}

