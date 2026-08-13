import { Container, Sprite, Texture } from 'pixi.js';
import GameConfig from '../config/GameConfig';
import type { Screen } from '../config/types';

const CELL = 96;
const GAP = 8;

export default class ReelsView extends Container {
	private readonly sprites: Sprite[][] = [];

	readonly gridWidth = GameConfig.REELS * CELL + (GameConfig.REELS - 1) * GAP;

	readonly gridHeight = GameConfig.ROWS * CELL + (GameConfig.ROWS - 1) * GAP;

	constructor() {
		super();

		for (let row = 0; row < GameConfig.ROWS; row += 1) {
			const rowSprites: Sprite[] = [];

			for (let col = 0; col < GameConfig.REELS; col += 1) {
				const sprite = new Sprite();
				sprite.width = CELL;
				sprite.height = CELL;
				sprite.x = col * (CELL + GAP);
				sprite.y = row * (CELL + GAP);
				this.addChild(sprite);
				rowSprites.push(sprite);
			}

			this.sprites.push(rowSprites);
		}
	}

	update(screen: Screen): void {
		for (let row = 0; row < GameConfig.ROWS; row += 1) {
			for (let col = 0; col < GameConfig.REELS; col += 1) {
				const rowSprites = this.sprites[row];
				const symbolRow = screen[row];
				if (!rowSprites || !symbolRow) {
					continue;
				}

				const sprite = rowSprites[col];
				const id = symbolRow[col];
				if (!sprite || !id) {
					continue;
				}

				sprite.texture = Texture.from(GameConfig.SYMBOL_ASSETS[id]);
				sprite.width = CELL;
				sprite.height = CELL;
			}
		}
	}
}
