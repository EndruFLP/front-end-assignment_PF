import { Container, Graphics, Text } from 'pixi.js';

const BTN = 40;

export default class StepButton extends Container {
	private readonly background: Graphics;

	constructor(label: string, onClick: () => void) {
		super();

		this.background = new Graphics().roundRect(-BTN / 2, -BTN / 2, BTN, BTN, 8).fill('#e4c04a');

		const text = new Text({
			text: label,
			style: {
				fontFamily: 'Arial, sans-serif',
				fontSize: 28,
				fill: '#1a1a1a',
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
