import { NODE_RECEIVE_DATA } from "@GameObjects/commands/nodes/events";
import { TestProgrammingScene } from "@src/scenes/TestProgrammingScene";
import { ActorsService, type ActorKey, type ActorParams } from "@src/services/ActorsService";

type ActorId = number;

export type Actor = {
    id: ActorId,
    key: ActorKey,
    params: ActorParams<ActorKey>
    data?: any[],
};

type WinCriteria = {
    type: 'actor-event',
    actorId: ActorId,
    event: string,
};

export type Level = {
    actors: Actor[]
    winCriteria: WinCriteria
};

export const level1: Level = {
    actors: [{
        id: 1,
        key: "MonochromeDisplayNode",
        params: [1480, 580]
    }, {
        id: 2,
        key: "RandomIntNode",
        params: [80, 560, true]
    }],
    winCriteria: {
        type: 'actor-event',
        actorId: 1,
        event: NODE_RECEIVE_DATA
    }
};

export const level2: Level = {
    actors: [{
        id: 1,
        key: "MonochromeDisplayNode",
        params: [1480, 360]
    },  {
        id: 2,
        key: "VarNode",
        params: [80, 560],
        data: [212],
    }, {
        id: 3,
        key: "VarNode",
        params: [150, 800],
        data: [9],
    }, {
        id: 4,
        key: "VarNode",
        params: [450, 800],
        data: [5],
    }, {
        id: 5,
        key: "VarNode",
        params: [700, 800],
        data: [32],
    }, {
        id: 6,
        key: "MultiplicationNode",
        params: [650, 350],
    }, {
        id: 7,
        key: "SubtractNode",
        params: [650, 950],
    }, {
        id: 8,
        key: "DivisionNode",
        params: [650, 500],
    }],
    winCriteria: { // @TODO: MAKE WIN CRITERIA BASED ON NEEDED RESULT
        type: 'actor-event',
        actorId: 1,
        event: NODE_RECEIVE_DATA
    }
};

/**
 * Manage levels in current campaign. Load/unload levels and translate between them.
 */
export class LevelsManager {
    constructor(
        protected readonly levels: Level[]
    ) {}

    public async loadLevel(
        scene: TestProgrammingScene,
        { actors, winCriteria }: Level,
        winCallback: (this: typeof scene) => any
    ) {
        const actorObjects = actors.map((actor) => {
            const actorInstance = ActorsService.getInstance()
                .getActorSpawner(actor.key, ...actor.params)(scene);

                if (actor.data) {
                    actorInstance.setDataWithValidation.apply(actorInstance, actor.data);
                }

                return {
                    actorInstance,
                    id: actor.id
                } as const;
        });

        const actorForWinCriteria = actorObjects.find(({ id }) => id === winCriteria.actorId);

        if (actorForWinCriteria) {
            actorForWinCriteria.actorInstance.once(winCriteria.event, winCallback, scene);
        }
    }

    public getLevel(index: number) {
        return this.levels[index];
    }

    public hasNextLevel(nextIndex: number): boolean {
        return !!this.levels[nextIndex];
    }
}
