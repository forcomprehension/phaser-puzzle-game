import { NodePin } from "../NodePin";
import { ON_PIN_CONNECTED, ON_PIN_DISCONNECTED } from "../nodepins/events";
import { PinPositionDescription } from "../pinPositionDescription";
import { BaseComponentsFactoryResult, CommandNode } from "./CommandNode";
import { RANDOM_INT_UPDATED } from "./events";

/**
 * Node which generate a random int value from range
 */
export class RandomIntNode extends CommandNode {
    public static readonly ACTOR_KEY = 'RandomIntNode';

    protected static readonly INITIAL_COLOR = [0, 91, 219] as const;

    protected rect: Optional<Phaser.GameObjects.Rectangle>;
    protected tween: Optional<Phaser.Tweens.Tween>;

    protected readonly color = new Phaser.Display.Color(...RandomIntNode.INITIAL_COLOR);

    protected readonly range = {
        min: 70,
        max: 90,
    };

    /**
     * Update value after timer
     */
    protected canUpdateValue: boolean = false;

    /**
     * @inheritdoc
     */
    protected getRightPins(): NodePin[] {
        const valuesPin = new NodePin(this.scene, PinPositionDescription.RIGHT_PIN);

        valuesPin.on(ON_PIN_CONNECTED, (myPin: NodePin, other: NodePin) => {
            const { parentContainer } = other;
            const forwardRandUpdated = function(value: number) {
                if (parentContainer.canReceiveData()) {
                    parentContainer.receiveData(myPin, String(value), other);
                }
            };

            this.on(RANDOM_INT_UPDATED, forwardRandUpdated, this);
            this.on(ON_PIN_DISCONNECTED, function disconnectPin(this: RandomIntNode, disconnectedPin: NodePin) {
                if (disconnectedPin === myPin) {
                    this.off(RANDOM_INT_UPDATED, forwardRandUpdated);
                    this.off(ON_PIN_DISCONNECTED, disconnectPin);
                }
            });
        });

        return [
            valuesPin
        ];
    }

    /**
     * @inheritdoc
     */
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
                    this.textComponent?.setText(this.getTemperatureText(randomValue));
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

    protected getTemperatureText(randomValue: number) {
        // @TODO: Argument name
        return `Temperature(${String(randomValue).padStart(2, '0')}) F`;
    }

    protected createBaseComponents(): BaseComponentsFactoryResult {
        const rect = this.rect = this.scene.add.rectangle(
            0,
            0,
            330,
            100,
            Phaser.Display.Color.GetColor(...RandomIntNode.INITIAL_COLOR),
        );

        const text = this.textComponent = this.scene.add.text(
            0,
            0,
            this.getTemperatureText(0),
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

        this.textComponent = this.rect = undefined;

        super.destroy(fromScene);
    }
}
