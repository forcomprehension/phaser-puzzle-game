import { IArgument } from "../vm/ICallable";

export interface IGameplayFunctionAgent {
    gameplayCall(...args: IArgument[]): any;
    functionLength(): number;
}
