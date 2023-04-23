import { BaseGameScene } from "@src/scenes/BaseGameScene";

import ScrollablePanel from "phaser3-rex-plugins/templates/ui/scrollablepanel/ScrollablePanel";
import FixWidthSizer from "phaser3-rex-plugins/templates/ui/fixwidthsizer/FixWidthSizer";
import RoundRectangle from "phaser3-rex-plugins/plugins/roundrectangle";
import { AbstractDashboardPresenter } from "./dashboardPresenters/AbstractDashboardPresenter";
import BaseSizer from "phaser3-rex-plugins/templates/ui/basesizer/BaseSizer";

export class ToolsDashboard {
    public static readonly PANEL_WIDTH = 250;

    public static readonly SIZER_NAME = 'sizer';

    protected toolsMap = new Map<string, AbstractDashboardPresenter>();

    protected panel: ScrollablePanel;
    protected sizer: FixWidthSizer;

    constructor(protected scene: BaseGameScene) {}

    public init() {
        const { scene } = this;
        const { canvasHeight, canvasWidth } = scene.getCanvasSize();

        const background = new RoundRectangle(scene);
        background.fillColor = 0x993333;
        background.alpha = 0.3;

        scene.add.existing(background);

        const sizer = this.sizer = new FixWidthSizer(scene, {
            name: ToolsDashboard.SIZER_NAME
        });
        scene.add.existing(sizer);

        this.panel = new ScrollablePanel(scene, {
            x: canvasWidth - ToolsDashboard.PANEL_WIDTH,
            space: {
                top: 20,
                bottom: 20,
                left: 10,
                right: 10,
            },
            y: 0,
            width: ToolsDashboard.PANEL_WIDTH,
            height: canvasHeight,
            background,
            panel: {
                child: sizer
            }
        }).setOrigin(0);

        scene.add.existing(this.panel);
    }

    public register(tool: AbstractDashboardPresenter) {
        const { toolKey } = tool;

        if (this.toolsMap.has(toolKey)) {
            throw new Error(`Attempt to register tool "${toolKey}" twice. Exiting`);
        }

        this.toolsMap.set(toolKey, tool);

        this.sizer.add(tool, {
            padding: {
                top: tool.y // @TODO: kostyl. FIX WITH GRID
            }
        });

        return this;
    }

    /**
     * @todo: kostyl
     */
    public seal() {
        this.panel.layout();

        this.toolsMap.forEach((tool) => {
            tool.afterAdd();
        })
    }

    public get(toolKey: string) {
        return this.toolsMap.get(toolKey)!;
    }

    // @TODO: DTOR
    public destroy() {
        
    }
}
