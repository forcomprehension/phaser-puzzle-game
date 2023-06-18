import { NODE_RECEIVE_DATA } from "@GameObjects/commands/nodes/events";
import type { TestProgrammingScene } from "@src/scenes/TestProgrammingScene";
import { ActorsService, type ActorKey, type ActorParams } from "@src/services/ActorsService";
import { ExpressionMap, ExpressionsContainer } from "./ExpressionsContainer";
import type { CommandNode } from "@GameObjects/commands/nodes/CommandNode";
import { NodePin } from "@GameObjects/commands/NodePin";

type ActorId = number;

export type Actor = {
    id: ActorId,
    key: ActorKey,
    params: ActorParams<ActorKey>
    data?: any[],
};

type WinCriteria = {
    actorId: ActorId,
} & ({
    type: 'actor-event',
    event: string,
} | {
    type: 'actor-check-math-data',
    mathExpression: string,
    pinIndex: number,
    expression: keyof typeof ExpressionMap
});

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
    winCriteria: {
        type: 'actor-check-math-data',
        actorId: 1,
        mathExpression: '$value 32 - 9 / 5 *',
        pinIndex: 0,
        expression: ExpressionsContainer.RPN.name
    }
};

type ActorObjectInfo = Readonly<{
    actorInstance: CommandNode,
    id: ActorId
}>;

/**
 * Manage levels in current campaign. Load/unload levels and translate between them.
 */
export class LevelsManager {
    constructor(
        protected readonly levels: Level[]
    ) {}

    public async loadLevel(
        scene: TestProgrammingScene,
        level: Level,
        winCallback: (this: TestProgrammingScene) => any
    ) {
        const { actors } = level;
        const actorObjects = actors.map<ActorObjectInfo>((actor) => {
            const actorInstance = ActorsService.getInstance()
                .getActorSpawner(actor.key, ...actor.params)(scene);

                if (actor.data) {
                    actorInstance.setDataWithValidation.apply(actorInstance, actor.data);
                }

                return {
                    actorInstance,
                    id: actor.id
                };
        });

        this.configureWinCriteria(level, actorObjects, scene, winCallback); // if false?
    }

    protected configureWinCriteria(
        { winCriteria }: Level,
        actorsInfo: ActorObjectInfo[],
        scene: TestProgrammingScene,
        winCallback: (this: TestProgrammingScene) => any
    ): boolean {
        const actorForWinCriteria = actorsInfo.find(({ id }) => id === winCriteria.actorId);
        if (!actorForWinCriteria) {
            return false;
        }

        switch(winCriteria.type) {
            case "actor-event": {
                actorForWinCriteria.actorInstance.once(winCriteria.event, winCallback, scene);

                return true;
            }
            case "actor-check-math-data": {
                actorForWinCriteria.actorInstance.on(NODE_RECEIVE_DATA, (_: NodePin, data: any) => {
                    const result = ExpressionMap[winCriteria.expression].func(
                        winCriteria.mathExpression.replace('$value', '212'), // @TODO: kostyl
                        Number(data)
                    );

                    if (result) {
                        winCallback.call(scene);
                    }
                });
                break;
            }
        }

        return false;
    }

    public getLevel(index: number) {
        return this.levels[index];
    }

    public hasNextLevel(nextIndex: number): boolean {
        return !!this.levels[nextIndex];
    }
}
