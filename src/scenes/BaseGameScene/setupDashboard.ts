import { AntiGravityPadSpawner } from "@GameObjects/antigravity/AntiGravityPadSpawner";
import type { BaseGameScene } from "../BaseGameScene";
import { BallSpawnerType, BallSpawner } from "@GameObjects/balls";
import { DrivingBeltDrawerTool } from "@GameObjects/connectors/DrivingBelt/DrivingBeltDrawerTool";
import { AntiGravityPadDashboardPresenter } from "@GameObjects/ToolsDashboard/dashboardPresenters/AntiGravityPadDashboardPresenter";
import { BallDashboardPresenter } from '@GameObjects/ToolsDashboard/dashboardPresenters/BallDashboardPresenter';
import { CannonDashboardPresenter } from '@GameObjects/ToolsDashboard/dashboardPresenters/CannonDashboardPresenter';
import { DrivingBeltDashboardPresenter } from '@GameObjects/ToolsDashboard/dashboardPresenters/DrivingBeltDashboardPresenter';
import { GearDashboardPresenter } from '@GameObjects/ToolsDashboard/dashboardPresenters/GearDashboardPresenter';
import { MotorDashboardPresenter } from "@GameObjects/ToolsDashboard/dashboardPresenters/MotorDashboardPresenter";
import { GearsSpawner, GearsSpawnerType } from "@GameObjects/gears";
import { MotorSpawner } from "@GameObjects/motors/MotorSpawner";
import { CannonSpawner } from "@GameObjects/cannon/CannonSpawner";
import { FlatBlockSpawnerType } from "@GameObjects/blocks/Spawners/flatBlockSpawnerType";
import { FlatBlockDashboardPresenter } from "@GameObjects/ToolsDashboard/dashboardPresenters/FlatBlockDashboardPresenter";
import { FlatBlockSpawner } from "@GameObjects/blocks/Spawners/FlatBlocksSpawner";

/**
 * Setup dashboard helper for Base Game Scene
 *
 * @param scene
 */
export function setupDashboard(scene: BaseGameScene) {
    scene.toolsDashboard.init();

    // Driving belt
    const drivingBeltDrawer = new DrivingBeltDrawerTool(scene);
    const drivingBeltPresenter = new DrivingBeltDashboardPresenter(scene, drivingBeltDrawer);
    drivingBeltDrawer.setDashboardPresenter(drivingBeltPresenter);
    scene.add.existing(drivingBeltDrawer);
    scene.add.existing(drivingBeltPresenter);

    // Anti-gravity pad
    const antiGravityPadSpawner = new AntiGravityPadSpawner(scene);
    const antiGravityPresenter = new AntiGravityPadDashboardPresenter(scene, antiGravityPadSpawner);
    antiGravityPadSpawner.setDashboardPresenter(antiGravityPresenter);
    scene.add.existing(antiGravityPadSpawner);
    scene.add.existing(antiGravityPresenter);

    // Gears
    const gearsPresenters = [GearsSpawnerType.Gear6, GearsSpawnerType.Gear12].map((gearSpawnerType) => {
        const gearSpawner = new GearsSpawner(scene, gearSpawnerType);
        const gearPresenter = new GearDashboardPresenter(scene, gearSpawner);
        gearSpawner.setDashboardPresenter(gearPresenter);
        scene.add.existing(gearPresenter);
        scene.add.existing(gearSpawner);

        return gearPresenter;
    });

    // Motor
    const motorSpawner = new MotorSpawner(scene);
    const motorPresenter = new MotorDashboardPresenter(scene, motorSpawner);
    motorSpawner.setDashboardPresenter(motorPresenter);
    scene.add.existing(motorPresenter);
    scene.add.existing(motorSpawner);

    // Cannon
    const cannonSpawner = new CannonSpawner(scene);
    const cannonPresenter = new CannonDashboardPresenter(scene, cannonSpawner);
    cannonSpawner.setDashboardPresenter(cannonPresenter);
    scene.add.existing(cannonSpawner);
    scene.add.existing(cannonPresenter);

    // Balls
    const ballPresenters = [
        BallSpawnerType.Basket,
        BallSpawnerType.Bouncy,
        BallSpawnerType.Bowling,
        BallSpawnerType.Eight,
        BallSpawnerType.Football
    ].map((ballType) => {
        const ballSpawner = new BallSpawner(scene, ballType);
        const ballPresenter = new BallDashboardPresenter(scene, ballSpawner);
        ballSpawner.setDashboardPresenter(ballPresenter);
        scene.add.existing(ballSpawner);
        scene.add.existing(ballPresenter);

        return ballPresenter;
    });

    // Blocks
    const blockPresenters = [
        FlatBlockSpawnerType.Metal,
        FlatBlockSpawnerType.Wood
    ].map((blockType) => {
        const blockSpawner = new FlatBlockSpawner(scene, blockType);
        const blockPresenter = new FlatBlockDashboardPresenter(scene, blockSpawner);
        blockSpawner.setDashboardPresenter(blockPresenter);
        scene.add.existing(blockSpawner);
        scene.add.existing(blockPresenter);

        return blockPresenter;
    });

    // Registration individual presenters
    scene.toolsDashboard
        .register(drivingBeltPresenter)
        .register(antiGravityPresenter)
        .register(motorPresenter)
        .register(cannonPresenter);

    // Register gears
    gearsPresenters.forEach((gearsPresenter) => {
        scene.toolsDashboard.register(gearsPresenter);
    });

    // Register balls
    ballPresenters.forEach((ballPresenter) => {
        scene.toolsDashboard.register(ballPresenter);
    });

    // Register blocks
    blockPresenters.forEach((blockPresenter) => {
        scene.toolsDashboard.register(blockPresenter);
    });

    scene.toolsDashboard.seal();
}
