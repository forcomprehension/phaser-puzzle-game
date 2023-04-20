
export default class TestScene extends Phaser.Scene {
    constructor(protected testCb: (scene: TestScene) => void) {
        super('test-scene');
    }

    create() {
        this.testCb(this);
    }
};
