import { IArgument, ICallable } from "../vm/ICallable";

type NativeFunctionSignature = {
    that: object | null | undefined;
    func: Function
};

export class NativeFunction implements ICallable {
    /// @TODO: use weakmap outside
    protected nativeFunctionSignature: NativeFunctionSignature;
    public setNativeFunction(functionSignature: NativeFunctionSignature) {
        this.nativeFunctionSignature = functionSignature;
    }

    public functionLength(): number {
        return this.nativeFunctionSignature.func.length;
    }

    public callFunction(...args: IArgument[]) {
        return this.nativeFunctionSignature.func.apply(
            this.nativeFunctionSignature.that,
            args.map((o) => o.value)
        );
    }
}