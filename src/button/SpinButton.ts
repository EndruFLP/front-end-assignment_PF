import { Circle, Container, Graphics, Sprite, Texture } from 'pixi.js';
import GameConfig from '../config/GameConfig';

const BUTTON_SIZE = 128;

const BG_GOLD_HOVER = '#c9a227';
const BG_GOLD = '#e4c04a';

export default class SpinButton extends Container {
	readonly size = BUTTON_SIZE;
	private readonly sprite: Sprite;
	private readonly background: Graphics;

	constructor(onSpin: () => void) {
		super();
		this.background = new Graphics().circle(0, 0, this.size / 2.26).fill(BG_GOLD);
		this.addChild(this.background);
		this.sprite = new Sprite(Texture.from(GameConfig.SPIN_BUTTON_IMG));
		this.sprite.anchor.set(0.5);
		this.sprite.width = BUTTON_SIZE;
		this.sprite.height = BUTTON_SIZE;
		this.addChild(this.sprite);
		this.eventMode = 'static';
		this.cursor = 'pointer';
		this.hitArea = new Circle(0, 0, this.radius);
		this.on('pointerover', () => this.setBackgroundColor(BG_GOLD_HOVER));
		this.on('pointerout', () => this.setBackgroundColor(BG_GOLD));
		this.on('pointerdown', onSpin);
	}

	get radius(): number {
		return this.size / 2;
	}

	private setBackgroundColor(color: string): void {
		this.background
			.clear()
			.circle(0, 0, this.size / 2.26)
			.fill(color);
	}
}
