import { IArgument, ICallable } from "../vm/ICallable";
import { IGameplayFunctionAgent } from "./IGameplayFunctionAgent";

export class GameplayFunction implements ICallable {
    // @TODO: use weakmap outside?
    protected gameplayObject: IGameplayFunctionAgent;
    public setGameplayObject(gameplayObject: IGameplayFunctionAgent) {
        this.gameplayObject = gameplayObject;
    }

    public callFunction(...args: IArgument[]) {
        return this.gameplayObject.gameplayCall(...args);
    }

    public functionLength(): number {
        return this.gameplayObject.functionLength();
    }
}
