import { CommandNode } from "./CommandNode";

export class BooleanVarNode extends CommandNode {

    protected ourValue: boolean = false;

    /**
     * @inheritdoc
     */
    protected getTextNode(): string {
        return String(this.ourValue);
    }

    /**
     * @inheritdoc
     */
    public setVar(value: boolean) {
        this.ourValue = value;
        this.textComponent?.setText(this.getTextNode());
    }
}
