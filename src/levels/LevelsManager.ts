import { NODE_RECEIVE_DATA } from "@GameObjects/commands/nodes/events";
import { TestProgrammingScene } from "@src/scenes/TestProgrammingScene";
import { ActorsService, type ActorKey, type ActorParams } from "@src/services/ActorsService";

type ActorId = number;

export type Actor = {
    id: ActorId,
    key: ActorKey,
    params: ActorParams<ActorKey>
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
