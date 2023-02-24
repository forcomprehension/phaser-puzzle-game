
/**
 * Interface marker for start/stop simulation in scene
 */
export interface ISimulated {
    /**
     * Scene handle this when simulation starts
     */
    simulationStart(): void;

    /**
     * Scene handle this when simulation ends
     */
    simulationEnd(): void;
}
