import { BranchNode } from "@GameObjects/commands/nodes/BranchNode";
import { DivisionNode } from "@GameObjects/commands/nodes/Math/DivisionNode";
import { MultiplicationNode } from "@GameObjects/commands/nodes/Math/MultiplicationNode";
import { SubtractNode } from "@GameObjects/commands/nodes/Math/SubtractNode";
import { ModuloNode } from "@GameObjects/commands/nodes/Math/ModuloNode";
import { MonochromeDisplayNode } from "@GameObjects/commands/nodes/MonochromeDisplayNode";
import { RandomIntNode } from "@GameObjects/commands/nodes/RandomIntNode";
import { LiteralNode } from "@GameObjects/commands/nodes/LiteralNode";
import { GreaterNode } from "@GameObjects/commands/nodes/Comparison/GreaterNode";
import { EqualNode } from "@GameObjects/commands/nodes/Comparison/EqualNode";
import { GreaterOrEqualNode } from "@GameObjects/commands/nodes/Comparison/GreaterOrEqualNode";
import { LessNode } from "@GameObjects/commands/nodes/Comparison/LessNode";
import { LessOrEqualNode } from "@GameObjects/commands/nodes/Comparison/LessOrEqualNode";

const actorsMap = {
    [MonochromeDisplayNode.ACTOR_KEY]: {
        factory: MonochromeDisplayNode.spawnerFactory,
        clazz: MonochromeDisplayNode,
    },
    [RandomIntNode.ACTOR_KEY]: {
        factory: RandomIntNode.spawnerFactory,
        clazz: RandomIntNode,
    },
    [DivisionNode.ACTOR_KEY]: {
        factory: DivisionNode.spawnerFactory,
        clazz: DivisionNode,
    },
    [ModuloNode.ACTOR_KEY]: {
        factory: ModuloNode.spawnerFactory,
        clazz: ModuloNode,
    },
    [MultiplicationNode.ACTOR_KEY]: {
        factory: MultiplicationNode.spawnerFactory,
        clazz: MultiplicationNode,
    },
    [SubtractNode.ACTOR_KEY]: {
        factory: SubtractNode.spawnerFactory,
        clazz: SubtractNode,
    },
    [LiteralNode.ACTOR_KEY]: {
        factory: LiteralNode.spawnerFactory,
        clazz: LiteralNode
    },
    [BranchNode.ACTOR_KEY]: {
        factory: BranchNode.spawnerFactory,
        clazz: BranchNode
    },
    [GreaterNode.ACTOR_KEY]: {
        factory: GreaterNode.spawnerFactory,
        clazz: GreaterNode,
    },
    [EqualNode.ACTOR_KEY]: {
        factory: EqualNode.spawnerFactory,
        clazz: EqualNode,
    },
    [GreaterOrEqualNode.ACTOR_KEY]: {
        factory: GreaterOrEqualNode.spawnerFactory,
        clazz: GreaterOrEqualNode,
    },
    [LessNode.ACTOR_KEY]: {
        factory: LessNode.spawnerFactory,
        clazz: LessNode,
    },
    [LessOrEqualNode.ACTOR_KEY]: {
        factory: LessOrEqualNode.spawnerFactory,
        clazz: LessOrEqualNode,
    },
} as const;

type ActorsMap = typeof actorsMap;
export type ActorKey = keyof typeof actorsMap;
export type ActorParams<Key extends keyof ActorsMap> = Parameters<ActorsMap[Key]['factory']>

/**
 * Service for spawn actors factories
 */
export class ActorsService {
    protected static $_instance: ActorsService;

    public readonly actorsMap = actorsMap;

    public static getInstance() {
        if (!this.$_instance) {
            this.$_instance = new ActorsService();
        }

        return this.$_instance;
    }

    /**
     * Get actor spawner factory by object
     */
    public getActorSpawner<Key extends ActorKey>(
        key: Key,
        ...params: ActorParams<Key>
    ) {
        const { factory, clazz } = actorsMap[key];
        return factory.apply(clazz, params);
    }
}
