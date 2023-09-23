
export interface IArgument {
    type: string;
    value: any;
}

export interface ICallable {
    callFunction(...args: IArgument[]): void;
    functionLength(): number;
}
