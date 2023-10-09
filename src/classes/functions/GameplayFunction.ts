import type { IArgument, ICallable } from "../vm/ICallable";
import type { IGameplayFunctionAgent } from "./IGameplayFunctionAgent";

export class GameplayFunction implements ICallable {
    // @TODO: use weakmap outside or set this in constructor?
    protected gameplayObject: IGameplayFunctionAgent;
    public setGameplayObject(gameplayObject: IGameplayFunctionAgent) {
        this.gameplayObject = gameplayObject;
        return this;
    }

    public callFunction(...args: IArgument[]) {
        this.gameplayObject.callWasPerformedWith(args)
        const result = this.gameplayObject.gameplayCall(...args);
        this.gameplayObject.notifySuccessfulCall();
        return result;
    }

    public functionLength(): number {
        return this.gameplayObject.functionLength();
    }
}
