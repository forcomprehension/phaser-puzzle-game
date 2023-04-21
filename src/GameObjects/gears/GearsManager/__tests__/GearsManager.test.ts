import { describe, test, expect } from '@jest/globals';
import { Gear6 } from '@GameObjects/gears/Gear6';
import { GearNodeReactiveImpl } from '../GearNodeReactiveImpl';
import { GearsManagerStub } from '../__stubs__/GearsManagerStub';
import { ROTATION_DIRECTION } from '@utils/types';
import createPhaserSceneWrapperForTests from '@src/testUtils/createPhaserSceneWrapperForTests';

type GearObjects = {
    gear: Gear6,
    node: GearNodeReactiveImpl,
};

const randomPositionComponent = () => Math.round(Math.random() * 10e3);

function createGears(scene: any, count: number) {
    const gearsManager = new GearsManagerStub(scene);

    const gearObjects: GearObjects[] = [];
    gearsManager.bulkUpdate(() => {
        for (let i = 0; i < count; count++) {
            const gear = new Gear6(scene, randomPositionComponent(), randomPositionComponent());
            gearsManager.registerGear(gear);

            gearObjects.push({
                gear,
                node: gearsManager.lastNode
            });
        }
    });

    return {
        gearObjects,
        gearsManager,
    }
}

describe.skip('GearStatesUpdater tests', () => {
    test('Test connection for two motors, through non-motor gear', async () => {
        await createPhaserSceneWrapperForTests((scene) => {
            const { gearsManager, gearObjects } = createGears(scene, 3);

            const [
                { gear: gearA },
                { gear: gearB },
                { gear: gearC },
            ] = gearObjects;

            // A,B is motors with one rotation direction, connected by C
            gearsManager.toggleMotor(gearA, ROTATION_DIRECTION.CW);
            gearsManager.toggleMotor(gearB, ROTATION_DIRECTION.CW);

            gearsManager.connectGears(gearA, gearC);
            gearsManager.connectGears(gearC, gearB);

            // No jams, all must rotate
            expect(gearsManager.getJammedSet().size).toBe(0);
            expect(gearsManager.getRotationSet().size).toBe(3);
        });
    });

    test('Test connection of 3 gears with central motor', async () => {
        await createPhaserSceneWrapperForTests((scene) => {
            const { gearsManager, gearObjects } = createGears(scene, 3);

            const [
                { gear: gearA },
                { gear: gearB },
                { gear: gearC },
            ] = gearObjects;

            // Make B as motor
            gearsManager.toggleMotor(gearB, ROTATION_DIRECTION.CCW);

            // Connects A to B and C to B, B is centered motor
            gearsManager.connectGears(gearA, gearB);
            gearsManager.connectGears(gearC, gearB);

            // No jams, all must rotate
            expect(gearsManager.getJammedSet().size).toBe(0);
            expect(gearsManager.getRotationSet().size).toBe(3);

            // Then connect A and C with belt
            gearsManager.connectGears(gearA, gearC, true);

            // All must be jammed
            expect(gearsManager.getJammedSet().size).toBe(3);
            expect(gearsManager.getRotationSet().size).toBe(0);

            // Then drag away C gear from B
            gearsManager.disconnectGears(gearC, gearB);

            // All must rotate
            expect(gearsManager.getJammedSet().size).toBe(3);
            expect(gearsManager.getRotationSet().size).toBe(0);
        });
    });
});
