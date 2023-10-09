import { IArgument } from "../vm/ICallable";

export interface IGameplayFunctionAgent {
    callWasPerformedWith(args: Readonly<IArgument>[]): void;
    gameplayCall(...args: IArgument[]): any;
    notifySuccessfulCall(): void;
    functionLength(): number;
}
