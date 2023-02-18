import { SequentialIdGenerator } from "@utils/sequentialIdGenerator";
import { GEAR_ROTATION_DIRECTION } from "./gearTypes";
import { GearGraph } from './GearGraph'
import { GearStatesUpdater } from "./GearStatesUpdater";

const seq = new SequentialIdGenerator();

/**
 * Manager for all gears in current scene
 */
export class GearsManager {
    protected readonly graph: GearGraph = new GearGraph();
    protected readonly gearsStateUpdater: GearStatesUpdater = new GearStatesUpdater(this.graph);

    /**
     * @param motorDirection - if undefined - this is not a motor
     */
    public addGear(motorDirection: GEAR_ROTATION_DIRECTION|undefined) {
        // @TODO: connect with gameplay object
        this.graph.addGear(seq.next(), motorDirection);
        this.updateGearStates();
    }

    /**
     * Removes current gear
     */
    public removeGear() {
        const key = ''; // @TODO: GET GEAR KEY
        this.graph.removeGear(key);
        this.updateGearStates();
    }

    public toggleMotor(motorDirection: GEAR_ROTATION_DIRECTION|undefined) {
        const key = ''; // @TODO: GET GEAR KEY
        this.graph.toggleMotor(key);
        this.updateGearStates();
    }

    /**
     * After changing
     */
    protected updateGearStates() {
        this.gearsStateUpdater.update();
    }
}
