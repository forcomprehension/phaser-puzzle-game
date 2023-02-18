import { GearGraph } from './GearGraph'
import { GearStatesUpdater } from "./GearStatesUpdater";
import { AbstractGear } from "@GameObjects/gears/AbstractGear";

/**
 * Manager for all gears in current scene
 */
export class GearsManager {
    protected readonly graph: GearGraph = new GearGraph();
    protected readonly gearsStateUpdater: GearStatesUpdater = new GearStatesUpdater(this.graph);

    /**
     * Adds gear to graph
     *
     * @param gear
     */
    public registerGear(gear: AbstractGear) {
        this.graph.addGear(gear.serialID, gear.getRotationDirection());
        this.updateGearStates();
    }

    /**
     * Removes gear from graph
     */
    public unregisterGear(gear: AbstractGear) {
        this.graph.removeGear(gear.serialID);
        this.updateGearStates();
    }

    /**
     * Toggle gear rotation in graph
     *
     * @param gear
     */
    public updateRotation(gear: AbstractGear) {
        this.graph.toggleMotor(gear.serialID, gear.getRotationDirection());
        this.updateGearStates();
    }

    /**
     * After changing
     */
    protected updateGearStates() {
        this.gearsStateUpdater.update();
    }
}
