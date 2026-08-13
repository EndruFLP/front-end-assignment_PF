import { Container, Sprite, Texture } from 'pixi.js';
import { GameConfig } from '../config/GameConfig';

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
		this.sprite.eventMode = 'static';
		this.sprite.cursor = 'pointer';
		this.sprite.on('pointerdown', onSpin);
		this.addChild(this.sprite);
	}

	get radius(): number {
		return this.size / 2;
	}
}
