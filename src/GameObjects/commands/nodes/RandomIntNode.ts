import { NodePin } from "../NodePin";
import { ON_PIN_CONNECTED, ON_PIN_DISCONNECTED } from "../nodepins/events";
import { BaseComponentsFactoryResult, CommandNode } from "./CommandNode";
import { MonochromeDisplayNode } from "./MonochromeDisplayNode";
import { RANDOM_INT_UPDATED } from "./events";

export class RandomIntNode extends CommandNode {
    protected rect: Optional<Phaser.GameObjects.Rectangle>;
    protected text: Optional<Phaser.GameObjects.Text>;

    protected tween: Optional<Phaser.Tweens.Tween>;

    protected static readonly INITIAL_COLOR = [0, 91, 219] as const;

    protected readonly color = new Phaser.Display.Color(...RandomIntNode.INITIAL_COLOR);

    protected readonly range = {
        min: 70,
        max: 90,
    };

    /**
     * Update value after timer
     */
    protected canUpdateValue: boolean = false;

    protected getRightPins(): NodePin[] {
        const valuesPin = new NodePin(this.scene, true);

        valuesPin.on(ON_PIN_CONNECTED, (myPin: NodePin, other: NodePin) => {
            // @TODO: kostyl
            const { parentContainer } = other;
            if (parentContainer instanceof MonochromeDisplayNode) {

                const forwardRandUpdated = function(value: number) {
                    parentContainer.updateText(String(value));
                };

                this.on(RANDOM_INT_UPDATED, forwardRandUpdated, this);
                this.on(ON_PIN_DISCONNECTED, function disconnectPin(this: RandomIntNode, disconnectedPin: NodePin) {
                    if (disconnectedPin === myPin) {
                        this.off(RANDOM_INT_UPDATED, forwardRandUpdated);
                        this.off(ON_PIN_DISCONNECTED, disconnectPin);
                    }
                });
            }
        });

        return [
            valuesPin
        ];
    }

    public init() {
        super.init();

        const updateValueGuard = this.scene.time.addEvent({
            loop: true,
            delay: 500,
            callback: () => {
                this.canUpdateValue = true;
            }
        });
        this.once(Phaser.GameObjects.Events.DESTROY, () => {
            updateValueGuard.destroy();
        });

        this.tween = this.scene.tweens.addCounter({
            useFrames: true,
            from: 0,
            to: 1,
            duration: 500,
            loop: -1,
            onUpdateScope: this,
            onUpdate(this: RandomIntNode, _, holder: { value: number }) {
                const randomValue = Phaser.Math.Between(this.range.min, this.range.max);

                this.color.h = holder.value;
                if (this.rect) {
                    this.rect.fillColor = this.color.color;
                }

                if (this.canUpdateValue) {
                    this.text?.setText(this.getVoltageText(randomValue));
                    this.emit(
                        RANDOM_INT_UPDATED,
                        randomValue
                    );

                    this.canUpdateValue = false;
                }
            }
        });

        return this;
    }

    protected getVoltageText(randomValue: number) {
        // @TODO: Argument name
        return `Voltage(${String(randomValue).padStart(2, '0')})`;
    }

    protected createBaseComponents(): BaseComponentsFactoryResult {
        const rect = this.rect = this.scene.add.rectangle(
            0,
            0,
            250,
            100,
            Phaser.Display.Color.GetColor(...RandomIntNode.INITIAL_COLOR),
        );

        const text = this.text = this.scene.add.text(
            0,
            0,
            this.getVoltageText(0),
            {
                fontSize: '24px',
                fontFamily: 'RobotoRegular',
            }
        ).setOrigin(.5);

        return {
            list: [
                rect,
                text
            ],
            mainComponent: rect
        }
    }

    public destroy(fromScene?: boolean | undefined): void {
        this.tween?.remove();

        this.text?.destroy(fromScene);
        this.rect?.destroy(fromScene);
        this.text = this.rect = undefined;

        super.destroy(fromScene);
    }
}
