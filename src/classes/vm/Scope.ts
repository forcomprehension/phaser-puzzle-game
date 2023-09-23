
type VariableInfo = {
    type: 'constant' | 'variable',
    value: any
};

/**
 * Scope
 */
export class Scope {
    /**
     * Symbols map
     */
    protected readonly scopeMap: Map<string, VariableInfo> = new Map();

    /**
     * Variables scope
     *
     * // @TODO: Can use real scopes and a scopes chain?
     *
     * @param parentScore
     */
    constructor(protected parentScore: Nullable<Scope>) {}

    /**
     * Assign a variable
     *
     * @param name
     * @param newInfo
     */
    public assign(name: string, newInfo: VariableInfo) {
        const oldInfo = this.scopeMap.get(name);
        if (oldInfo?.type === 'constant') {
            throw new SyntaxError(`Identifier ${name} is already assigned`);
        }

        this.scopeMap.set(name, newInfo);
    }

    /**
     * Has own property?
     *
     * @param name
     */
    public scopeHasOwnProperty(name: string) {
        return this.scopeMap.has(name);
    }

    /**
     * "in operator" representation
     *
     * @param name
     */
    public in(name: string) {
        let currentScope: Nullable<Scope> = this;
        do {
            if (currentScope.scopeMap.has(name)) {
                return true;
            }

            currentScope = this.parentScore;
        } while (currentScope);

        return false;
    }

    /**
     * "typeof operator" representation
     *
     * @param name
     *
     * @returns type of object
     */
    public typeof(name: string) {
        let currentScope: Nullable<Scope> = this;
        do {
            if (currentScope.scopeMap.has(name)) {
                return typeof currentScope.scopeMap.get(name)!.value;
            }

            currentScope = this.parentScore;
        } while (currentScope);

        // @TODO: own types?
        return undefined;
    }

    /**
     * "Get value" operation
     *
     * @param name
     */
    public get(name: string) {
        let currentScope: Nullable<Scope> = this;
        do {
            if (currentScope.scopeMap.has(name)) {
                return typeof currentScope.scopeMap.get(name)!.value;
            }

            currentScope = this.parentScore;
        } while (currentScope);

        // @TODO: own types?
        return undefined;
    }
}
