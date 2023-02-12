import { describe, test } from '@jest/globals';
import { GEAR_ROTATION_DIRECTION, GearGraph } from '../GearGraph'

describe('GearGraph test', () => {
    test('test edges iterator', () => {
        const g = new GearGraph();

        g.addGear('a', GEAR_ROTATION_DIRECTION.CW);
        g.addGear('b');
        g.addGear('c');
        g.addGear('d');


        g.addGear('e', GEAR_ROTATION_DIRECTION.CCW);
        g.addGear('f');
        g.addGear('g');

        g.setEdge('a', 'b');
        g.setEdge('a', 'c');
        g.setEdge('b', 'c');
        g.setEdge('c', 'd');

        g.setEdge('e', 'f');
        g.setEdge('f', 'g');

        g.updateGearsStates();
    });
});
