import { MonochromeDisplayNode } from "@GameObjects/commands/nodes/MonochromeDisplayNode";
import { RandomIntNode } from "@GameObjects/commands/nodes/RandomIntNode";

const actorsMap = {
    [MonochromeDisplayNode.ACTOR_KEY]: {
        factory: MonochromeDisplayNode.spawnerFactory,
        clazz: MonochromeDisplayNode,
    },
    [RandomIntNode.ACTOR_KEY]: {
        factory: RandomIntNode.spawnerFactory,
        clazz: RandomIntNode,
    }
} as const;

type ActorsMap = typeof actorsMap;
export type ActorKey = keyof typeof actorsMap;
export type ActorParams<Key extends keyof ActorsMap> = Parameters<ActorsMap[Key]['factory']>

export class ActorsService {
    protected static $_instance: ActorsService;

    public static getInstance() {
        if (!this.$_instance) {
            this.$_instance = new ActorsService();
        }

        return this.$_instance;
    }

    public getActorSpawner<Key extends ActorKey>(
        key: Key,
        ...params: ActorParams<Key>
    ) {
        const { factory, clazz } = actorsMap[key];
        return factory.apply(clazz, params);
    }
}
