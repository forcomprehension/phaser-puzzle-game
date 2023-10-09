import { CALL_ACTOR_CALLED_WITH } from "@GameObjects/commands/nodes/events";
import type { TestProgrammingScene } from "@src/scenes/TestProgrammingScene";
import { ActorsService } from "@src/services/ActorsService";
import { ExpressionMap } from "./ExpressionsContainer";
import type { CommandNode } from "@GameObjects/commands/nodes/CommandNode";
import type { IArgument } from "@src/classes/vm/ICallable";
import { ActorId, Level } from "./levelsList";

type ActorObjectInfo = Readonly<{
    actorInstance: CommandNode,
    id: ActorId
}>;

/**
 * Manage levels in current campaign. Load/unload levels and translate between them.
 */
export class LevelsManager {
    public firstActorOfCurrentLevel: Optional<CommandNode>;

    constructor(
        protected readonly levels: Level[]
    ) {}

    public async loadLevel(
        scene: TestProgrammingScene,
        level: Level,
        winCallback: (this: TestProgrammingScene) => any
    ) {
        const { actors } = level;
        const actorObjects = actors.map<ActorObjectInfo>((actor, index) => {
            const actorInstance = ActorsService.getInstance()
                .getActorSpawner(actor.key, ...actor.params)(scene);

                if (actor.data) {
                    actorInstance.setDataWithValidation.apply(actorInstance, actor.data);
                }

                if (index === 0) {
                    this.firstActorOfCurrentLevel = actorInstance;
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
            case "call-actor-check-math-data": {
                const { mathExpression, expression } = winCriteria;
                // @TODO: do we need expression map?
                const rpnFunction = ExpressionMap[expression].func;

                function subscribeOnCallActorCalledWith(args: Readonly<IArgument>[]) {
                    const matched = rpnFunction(mathExpression, args[0].value);

                    if (matched) {
                        // @TODO: Y it might be undefined?
                        actorForWinCriteria?.actorInstance.off(CALL_ACTOR_CALLED_WITH, subscribeOnCallActorCalledWith);
                        winCallback.call(scene);
                    } else {
                        console.warn(`Incorrect solution of RPN: "${mathExpression}."`);
                    }
                }
                // @TODO: Check success call!

                actorForWinCriteria.actorInstance.on(CALL_ACTOR_CALLED_WITH, subscribeOnCallActorCalledWith);
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
