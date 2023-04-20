import { AbstractGear } from '@GameObjects/gears/AbstractGear';
import { GearNodeReactiveImpl } from '../GearNodeReactiveImpl';
import { GearsManager } from '../GearsManager';

export class GearsManagerStub extends GearsManager {
    public addedNodes: GearNodeReactiveImpl[] = [];

    protected createGearNode(gear: AbstractGear): GearNodeReactiveImpl {
        const node = super.createGearNode(gear);
        this.addedNodes.push(node);

        return node;
    }

    public get lastNode() {
        return this.addedNodes[Math.max(0, this.addedNodes.length - 1)];
    }

    public getGraph() {
        return this.graph;
    }

    public getJammedSet() {
        return this.jammedSet;
    }

    public getRotationSet() {
        return this.rotationSet;
    }
}
