
export type DebuggerState = 'paused' | 'idle';

export class Debugger {
    /**
     * Current state
     */
    protected $state: DebuggerState = 'idle';

    /**
     * Debugger state getter
     */
    public get state() {
        return this.$state;
    }

    public async actionRun() {

    }
}

