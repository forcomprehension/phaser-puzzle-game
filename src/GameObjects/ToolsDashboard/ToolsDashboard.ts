import { BaseGameScene } from "@src/scenes/BaseGameScene";

import ScrollablePanel from "phaser3-rex-plugins/templates/ui/scrollablepanel/ScrollablePanel";
import RoundRectangle from "phaser3-rex-plugins/plugins/roundrectangle";
import { AbstractDashboardPresenter } from "./dashboardPresenters/AbstractDashboardPresenter";
import { Sizer } from "phaser3-rex-plugins/templates/ui/ui-components";
import { DASHBOARD_PRESENTER_HIDE, DASHBOARD_PRESENTER_SHOW } from "./dashboardPresenters/events";

/**
 * Tools dashboard container
 */
export class ToolsDashboard {
    public static readonly PANEL_WIDTH = 250;

    public static readonly SIZER_NAME = 'sizer';

    protected toolsMap = new Map<string, AbstractDashboardPresenter>();

    protected panel: ScrollablePanel;
    protected sizer: Sizer;

    /**
     * Ctor
     *
     * @param scene
     */
    constructor(protected scene: BaseGameScene) {}

    public init() {
        const { scene } = this;
        const { canvasHeight, canvasWidth } = scene.getCanvasSize();

        const background = new RoundRectangle(scene);
        background.fillColor = 0x993333;
        background.alpha = 0.3;

        scene.add.existing(background);

        this.sizer = new Sizer(this.scene, {
            orientation: 'y',
            space: {
                left: 6,
                right: 6,
                top: 6,
                bottom: 60,
                item: 6
            }
        });

        scene.add.existing(this.sizer);

        this.panel = new ScrollablePanel(scene, {
            x: canvasWidth - ToolsDashboard.PANEL_WIDTH,
            space: {
                bottom: 10,
            },
            y: 0,
            width: ToolsDashboard.PANEL_WIDTH,
            height: canvasHeight,
            background,
            panel: {
                child: this.sizer
            }
        }).setOrigin(0);

        scene.add.existing(this.panel);
    }

    public register(tool: AbstractDashboardPresenter) {
        const toolKey = tool.getToolKey();

        if (this.toolsMap.has(toolKey)) {
            throw new Error(`Attempt to register tool "${toolKey}" twice. Exiting`);
        }

        this.toolsMap.set(toolKey, tool);

        const background1 = new RoundRectangle(this.scene);
        background1.fillColor = 0x0000FF;
        background1.alpha = 0.7;

        const current = this.scene.rexUI.add.sizer({
            // width: ToolsDashboard.PANEL_WIDTH,
            height: 200,
        }).add(tool, {
            align: 'center',
            padding: {
                left: -75
            }
        }).addBackground(background1).setOrigin(0);

        tool.on(DASHBOARD_PRESENTER_SHOW, () => {
            current.show();
            current.layout();
            this.panel.layout();
        });

        tool.on(DASHBOARD_PRESENTER_HIDE, () => {
            current.hide();
            current.layout();
            this.panel.layout();
        });

        this.sizer.add(current);

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
        this.toolsMap.clear();

        // @ts-ignore
        this.scene = this.panel = this.sizer = undefined;
    }
}
