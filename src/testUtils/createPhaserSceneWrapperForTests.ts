import TestScene from "./TestScene";

export default function createPhaserSceneWrapperForTests(testCb: (scene: TestScene) => void) {
    return new Promise<void>((res) => {
       const scene = new TestScene(testCb);
       try {
        scene.create();
        res();
       } catch (e) {
        console.log(e);
        res();
       }
    });
}
