import { AbstractGear } from "@GameObjects/gears/AbstractGear";
import { ROTATION_DIRECTION } from "@utils/types";
import { GearNode } from "./GearGraph";
import { checkRotationDirectionIsRotated } from "./utils";

const isMotorRealPropertySymbol = Symbol('$isMotor');
const rotationSetSymbol = Symbol('$rotationSet');
const jammedSetSymbol = Symbol('$jammedSet');

/**
 * Reactive implementation of gear node.
 */
export class GearNodeReactiveImpl implements GearNode {
    protected [isMotorRealPropertySymbol]: boolean = false;
    protected [rotationSetSymbol]: Set<AbstractGear>;
    protected [jammedSetSymbol]: Set<AbstractGear>;

    /**
     * Ctor
     */
    constructor(
        rotationSet: Set<AbstractGear>,
        jammedSet: Set<AbstractGear>,
        protected gear: AbstractGear
    ) {
        this[isMotorRealPropertySymbol] = false;
        this[rotationSetSymbol] = rotationSet;
        this[jammedSetSymbol] = jammedSet;
    }

    public get isMotor() {
        return this[isMotorRealPropertySymbol];
    }

    public set isMotor(isMotor: boolean) {
        this[isMotorRealPropertySymbol] = isMotor;
    }

    public set isJammed(isJammed: boolean) {
        if (isJammed) {
            this[jammedSetSymbol].add(this.gear);
        } else {
            this[jammedSetSymbol].delete(this.gear);
        }
    }

    public get isJammed() {
        return this[jammedSetSymbol].has(this.gear);
    }

    public get direction() {
        return this.gear.getRotationDirection();
    }

    public set direction(newDirection: ROTATION_DIRECTION) {
        this.gear.setRotationDirection(newDirection);
        if (checkRotationDirectionIsRotated(newDirection)) {
            this[rotationSetSymbol].add(this.gear);
        } else {
            this[rotationSetSymbol].delete(this.gear);
        }
    }
}
