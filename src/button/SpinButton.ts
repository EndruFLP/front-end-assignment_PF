import { Circle, Container, Sprite, Texture } from 'pixi.js';
import GameConfig from '../config/GameConfig';

const BUTTON_SIZE = 128;

export default class SpinButton extends Container {
	readonly size = BUTTON_SIZE;
	private readonly sprite: Sprite;

	constructor(onSpin: () => void) {
		super();

		this.sprite = new Sprite(Texture.from(GameConfig.SPIN_BUTTON_IMG));
		this.sprite.anchor.set(0.5);
		this.sprite.width = BUTTON_SIZE;
		this.sprite.height = BUTTON_SIZE;
		this.addChild(this.sprite);
		this.eventMode = 'static';
		this.cursor = 'pointer';
		this.hitArea = new Circle(0, 0, this.radius);
		this.on('pointerdown', onSpin);
	}

	get radius(): number {
		return this.size / 2;
	}
}
