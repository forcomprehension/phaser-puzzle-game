import { RandomIntNode } from "@GameObjects/commands/nodes/RandomIntNode";
import { ExpressionMap, ExpressionsContainer } from "./ExpressionsContainer";
import type { ActorKey, ActorParams } from "@src/services/ActorsService";
import { MonochromeDisplayNode } from "@GameObjects/commands/nodes/MonochromeDisplayNode";
import { CALL_ACTOR_CALLED } from "@GameObjects/commands/nodes/events";
import { LiteralNode } from "@GameObjects/commands/nodes/LiteralNode";
import { MultiplicationNode } from "@GameObjects/commands/nodes/Math/MultiplicationNode";
import { SubtractNode } from "@GameObjects/commands/nodes/Math/SubtractNode";
import { DivisionNode } from "@GameObjects/commands/nodes/Math/DivisionNode";

/// Internal types

/**
 * Internal actor representation
 */
type ActorIncompleteType = {
    key: ActorKey,
    params: ActorParams<ActorKey>
    data?: any[],
};

/**
 * Internal level representation
 */
type LevelIncompleteType = {
    actors: ActorIncompleteType[],
    winCriteria: WinCriteria
};


/// Real types

/**
 * Actor id
 */
export type ActorId = number;

/**
 * @TODO: Move win criteria into actor?
 */
type WinCriteria = {
    actorId: ActorId,
} & ({
    type: 'actor-event',
    event: string,
} | {
    type: 'actor-check-math-data',
    mathExpression: string,
    expectedValue: number, // Do we need separate expected value and expression?
    expression: keyof typeof ExpressionMap
});

/**
 * Actor type
 */
export type Actor = ActorIncompleteType & {
    id: ActorId;
};

/**
 * Level type
 */
export type Level = {
    actors: Actor[]
    winCriteria: WinCriteria
};

function buildActorEventWinCriteria(actorIndex: number, event: string): WinCriteria {
    return {
        type: 'actor-event',
        actorId: actorIndex + 1,
        event
    };
}

function buildActorEventCheckArgsWinCriteria(
    actorIndex: number,
    mathExpression: string,
    expectedValue: number
): WinCriteria {
    return {
        type: 'actor-check-math-data',
        actorId: actorIndex + 1,
        mathExpression,
        expectedValue,
        expression: ExpressionsContainer.RPN.name
    }
}

/**
 * Prepare actors for export
 *
 * @param incompleteActors
 */
function prepareActors(incompleteActors: ActorIncompleteType[]): Actor[] {
    return incompleteActors.map<Actor>((incompleteActor, index) => ({
        id: index + 1,
        ...incompleteActor
    }))
}

/**
 * Prepare levels for export
 *
 * @param incompleteLevels
 */
function prepareLevels(incompleteLevels: LevelIncompleteType[]): Level[] {
    return incompleteLevels.map<Level>((incompleteLevel) => ({
        actors: prepareActors(incompleteLevel.actors),
        winCriteria: incompleteLevel.winCriteria,
    }));
}

export const levels: Level[] = prepareLevels([
    // Уровень: Соединение нод между собой
    {
        actors: [{
            key: RandomIntNode.ACTOR_KEY,
            params: [80, 560, true],
        }, {
            key: MonochromeDisplayNode.ACTOR_KEY,
            params: [1480, 580],
        }],
        winCriteria: buildActorEventWinCriteria(1, CALL_ACTOR_CALLED)
    },

    // Уровень: Математические операторы (часть 2)
    {
        actors: [{
            key: LiteralNode.ACTOR_KEY,
            params: [80, 560],
            data: [212],
        }, {
            key: MonochromeDisplayNode.ACTOR_KEY,
            params: [1480, 360]
        }, {
            key: LiteralNode.ACTOR_KEY,
            params: [150, 800],
            data: [9],
        }, {
            key: LiteralNode.ACTOR_KEY,
            params: [450, 800],
            data: [5],
        }, {
            key: LiteralNode.ACTOR_KEY,
            params: [700, 800],
            data: [32],
        }, {
            key: MultiplicationNode.ACTOR_KEY,
            params: [650, 350],
        }, {
            key: SubtractNode.ACTOR_KEY,
            params: [650, 950],
        }, {
            key:DivisionNode.ACTOR_KEY,
            params: [650, 500],
        }],
        winCriteria: buildActorEventCheckArgsWinCriteria(
            1,
            '$value 32 - 9 / 5 *',
            212
        )
    }
]);
