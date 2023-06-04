import { CommandNode } from "@GameObjects/commands/nodes/CommandNode";
import { BaseGameScene } from "./BaseGameScene";

export class TestProgrammingScene extends BaseGameScene {

    public enableDashboard: boolean = false;

    constructor() {
        super('ProgrammingScene');
    }

    public create() {
        super.create();

        new CommandNode(this, 200, 300);
        new CommandNode(this, 400, 500);
    }
}

