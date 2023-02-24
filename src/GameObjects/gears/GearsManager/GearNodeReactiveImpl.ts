import { AbstractGear } from "@GameObjects/gears/AbstractGear";
import { ROTATION_DIRECTION } from "@utils/types";
import { GearNode } from "./GearGraph";
import { checkRotationDirectionIsRotated } from "./utils";

const isMotorRealPropertySymbol = Symbol('$isMotor');

/**
 * Reactive implementation of gear node.
 */
export class GearNodeReactiveImpl implements GearNode {
    protected [isMotorRealPropertySymbol]: boolean = false;

    constructor(
        protected rotationSet: Set<AbstractGear>,
        protected jammedSet: Set<AbstractGear>,
        protected gear: AbstractGear,
        isMotor: boolean = false
    ) {
        this[isMotorRealPropertySymbol] = isMotor;
    }

    public get isMotor() {
        return this[isMotorRealPropertySymbol];
    }

    public set isMotor(isMotor: boolean) {
        this[isMotorRealPropertySymbol] = isMotor;
    }

    public set isJammed(isJammed: boolean) {
        if (isJammed) {
            this.jammedSet.add(this.gear);
        } else {
            this.jammedSet.delete(this.gear);
        }
    }

    public get isJammed() {
        return this.jammedSet.has(this.gear);
    }

    public get direction() {
        return this.gear.getRotationDirection();
    }

    public set direction(newDirection: ROTATION_DIRECTION) {
        this.gear.setRotationDirection(newDirection);
        if (checkRotationDirectionIsRotated(newDirection)) {
            this.rotationSet.add(this.gear);
        } else {
            this.rotationSet.delete(this.gear);
        }
    }
}
