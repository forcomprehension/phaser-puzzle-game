import { IArgument } from "../vm/ICallable";

export interface IGameplayFunctionAgent {
    callWillBePerformedWith(args: Readonly<IArgument>[]): void;
    gameplayCall(...args: IArgument[]): any;
    notifySuccessfulCall(): void;
    functionLength(): number;
}
