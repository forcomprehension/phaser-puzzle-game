import { BranchNode } from "@GameObjects/commands/nodes/BranchNode";
import { DivisionNode } from "@GameObjects/commands/nodes/Math/DivisionNode";
import { MultiplicationNode } from "@GameObjects/commands/nodes/Math/MultiplicationNode";
import { SubtractNode } from "@GameObjects/commands/nodes/Math/SubtractNode";
import { MonochromeDisplayNode } from "@GameObjects/commands/nodes/MonochromeDisplayNode";
import { RandomIntNode } from "@GameObjects/commands/nodes/RandomIntNode";
import { LiteralNode } from "@GameObjects/commands/nodes/LiteralNode";

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
    }
} as const;

type ActorsMap = typeof actorsMap;
export type ActorKey = keyof typeof actorsMap;
export type ActorParams<Key extends keyof ActorsMap> = Parameters<ActorsMap[Key]['factory']>

/**
 * Service for spawn actors factories
 */
export class ActorsService {
    protected static $_instance: ActorsService;

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
