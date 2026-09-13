import { Container, Text } from 'pixi.js';
import Theme from '../config/Theme';

/** Multiline win text that scales to fit the available area. */
export default class WinText extends Container {
	private readonly winLabel: Text;
	private maxW = 0;
	private maxH = 0;

	constructor() {
		super();

		this.winLabel = new Text({
			text: 'Total wins: 0',
			style: {
				fontFamily: 'Arial, sans-serif',
				fontSize: 22,
				fill: Theme.TEXT,
				align: 'left',
				wordWrap: true,
				wordWrapWidth: 700,
				lineHeight: 28,
			},
		});
		this.winLabel.anchor.set(0.5, 0);
		this.addChild(this.winLabel);
	}

	setBounds(maxW: number, maxH: number): void {
		this.maxW = maxW;
		this.maxH = maxH;
		this.winLabel.style.wordWrapWidth = maxW;
		this.fit();
	}

	setText(value: string): void {
		this.winLabel.text = value;
		this.winLabel.scale.set(1);
		this.fit();
	}

	private fit(): void {
		if (this.maxW <= 0 || this.maxH <= 0) {
			return;
		}

		this.winLabel.scale.set(1);
		const sx = this.winLabel.width > 0 ? this.maxW / this.winLabel.width : 1;
		const sy = this.winLabel.height > 0 ? this.maxH / this.winLabel.height : 1;
		this.winLabel.scale.set(Math.min(1, sx, sy));
	}
}
