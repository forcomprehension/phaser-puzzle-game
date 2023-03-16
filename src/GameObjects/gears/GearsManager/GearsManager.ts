import { GameObjects } from 'phaser';
import { AbstractGear } from "@GameObjects/gears/AbstractGear";
import { ROTATION_DIRECTION } from '@utils/types';
import type { ISimulated } from '@interfaces/ISimulated';
import { GearGraph } from './GearGraph';
import { GearNodeReactiveImpl } from './GearNodeReactiveImpl';
import { GearStatesUpdater } from './GearStatesUpdater';
import { checkRotationDirectionIsRotated } from './utils';

/**
 * Manager for all gears in current scene.
 */
export class GearsManager extends GameObjects.GameObject implements ISimulated {
    protected readonly graph: GearGraph = new GearGraph();
    protected readonly gearsStateUpdater: GearStatesUpdater = new GearStatesUpdater(this.graph);

    protected readonly jammedSet: Set<AbstractGear> = new Set();
    protected readonly rotationSet: Set<AbstractGear> = new Set();

    protected bulkModeEnabled: boolean = false;

    /**
     * Tweening handler
     *
     * It will be used by tweening
     */
    public rotation: number = 0;

    /**
     * Ctor
     *
     * @param scene
     */
    constructor(scene: Phaser.Scene) {
        super(scene, GearsManager.name);
    }

    /**
     * Adds gear to graph
     *
     * @param gear
     */
    public registerGear(gear: AbstractGear) {
        this.graph.addGear(gear.serialID, this.createGearNode(gear));
        this.updateGearStates();

        return this;
    }

    /**
     * Removes gear from graph
     */
    public unregisterGear(gear: AbstractGear) {
        this.graph.removeGear(gear.serialID);
        this.updateGearStates();

        return this;
    }

    /**
     * Toggles motor
     *
     * @param gear
     * @param rotationDirection
     */
    public toggleMotor(gear: AbstractGear, rotationDirection?: ROTATION_DIRECTION) {
        this.graph.toggleMotor(gear.serialID, rotationDirection);
        this.updateGearStates();

        return this;
    }

    /**
     * Connect two gears
     *
     * @param lhs
     * @param rhs
     */
    public connectGears(lhs: AbstractGear, rhs: AbstractGear) {
        this.graph.connectGears(lhs.serialID, rhs.serialID);
        this.updateGearStates();

        return this;
    }

    /**
     * Disconnects gear from all another gears
     *
     * @param gear
     */
    public disconnectGear(gear: AbstractGear) {
        this.graph.disconnectGear(gear.serialID);

        return this;
    }

    /**
     * Gears has direct connection?
     *
     * @param lhs
     * @param rhs
     * @returns
     */
    public hasConnection(lhs: AbstractGear, rhs: AbstractGear) {
        return this.graph.hasConnection(lhs.serialID, rhs.serialID);
    }

    /**
     * After changing properties, we must update gears state
     */
    protected updateGearStates() {
        if (!this.bulkModeEnabled) {
            this.gearsStateUpdater.update();
        }
    }

    /**
     * Update for jammed flip/flop animations
     */
    public updateJammed(radians: number) {
        for (const gear of this.jammedSet) {
            if (checkRotationDirectionIsRotated(gear.getRotationDirection())) {
                gear.setRotation(radians);
            }
        }
    }

    /**
     * Update non-jammed gears rotations
     */
    public updateRotations() {
        for (const gear of this.rotationSet) {
            const direction = gear.getRotationDirection();
            if (checkRotationDirectionIsRotated(direction)) {
                if (direction === ROTATION_DIRECTION.CW) {
                    gear.setRotation(this.rotation);
                } else {
                    gear.setRotation(Phaser.Math.DEG_TO_RAD - this.rotation);
                }
            }
        }
    }

    /**
     * Wrapper for bulk actions mode
     *
     * @param cb
     */
    public bulkUpdate(block: () => any) {
        this.bulkModeEnabled = true;
        block();
        this.bulkModeEnabled = false;
        this.updateGearStates();
    }

    /**
     * Make a proxy object for updating current gear from gear states updater
     *
     * @param gear
     */
    protected createGearNode(gear: AbstractGear) {
        return new GearNodeReactiveImpl(this.rotationSet, this.jammedSet, gear);
    }

    // region Interface ISimulated
    public simulationStart(): void {
        throw new Error('Method not implemented.');
    }

    public simulationEnd(): void {
        throw new Error('Method not implemented.');
    }
    // endregion

    /**
     * Dtor
     *
     * @param fromScene
     */
    public destroy(fromScene?: boolean | undefined): void {
        super.destroy(fromScene);

        // @ts-ignore
        this.gearsStateUpdater = this.graph = null;
        this.jammedSet.clear();
        this.rotationSet.clear();
    }
}
