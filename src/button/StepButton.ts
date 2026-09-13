import { Container, Graphics, Text } from 'pixi.js';
import Theme from '../config/Theme';

const BTN = 40;

export default class StepButton extends Container {
	private readonly background: Graphics;

	constructor(label: string, onClick: () => void) {
		super();

		this.background = new Graphics().roundRect(-BTN / 2, -BTN / 2, BTN, BTN, 8).fill(Theme.GOLD);

		const text = new Text({
			text: label,
			style: {
				fontFamily: 'Arial, sans-serif',
				fontSize: 28,
				fill: Theme.INK,
			},
		});
		text.anchor.set(0.5);

		this.addChild(this.background, text);
		this.on('pointerdown', onClick);
		this.enableButton();
	}

	enableButton(): void {
		this.eventMode = 'static';
		this.cursor = 'pointer';
		this.alpha = 1;
	}

	disableButton(): void {
		this.eventMode = 'none';
		this.cursor = 'default';
		this.alpha = 0.6;
	}
}
