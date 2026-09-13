import { Container, Graphics, Sprite, Texture } from 'pixi.js';
import GameConfig from '../config/GameConfig';
import Theme from '../config/Theme';
import type { Cell, Screen } from '../config/types';

const CELL = 96;
const GAP = 8;
const BG_PAD = 10;

export default class ReelsView extends Container {
	private readonly highlights: Graphics[][] = [];
	private readonly sprites: Sprite[][] = [];

	readonly gridWidth = GameConfig.REELS * CELL + (GameConfig.REELS - 1) * GAP + BG_PAD * 2;

	readonly gridHeight = GameConfig.ROWS * CELL + (GameConfig.ROWS - 1) * GAP + BG_PAD * 2;

	constructor() {
		super();

		this.addChild(
			new Graphics().roundRect(0, 0, this.gridWidth, this.gridHeight, 10).fill(Theme.REEL_FRAME),
			new Graphics()
				.roundRect(6, 6, this.gridWidth - 12, this.gridHeight - 12, 6)
				.fill(Theme.REEL_WELL),
		);

		for (let row = 0; row < GameConfig.ROWS; row += 1) {
			const rowHighlights: Graphics[] = [];
			const rowSprites: Sprite[] = [];

			for (let col = 0; col < GameConfig.REELS; col += 1) {
				const x = BG_PAD + col * (CELL + GAP);
				const y = BG_PAD + row * (CELL + GAP);

				const highlight = new Graphics().roundRect(x, y, CELL, CELL, 6).fill(Theme.WIN);
				highlight.visible = false;
				this.addChild(highlight);
				rowHighlights.push(highlight);

				const sprite = new Sprite();
				sprite.width = CELL;
				sprite.height = CELL;
				sprite.x = x;
				sprite.y = y;
				this.addChild(sprite);
				rowSprites.push(sprite);
			}

			this.highlights.push(rowHighlights);
			this.sprites.push(rowSprites);
		}
	}

	update(screen: Screen, highlightCells: readonly Cell[] = []): void {
		const marked = new Set(highlightCells.map((cell) => `${cell.row},${cell.col}`));

		for (let row = 0; row < GameConfig.ROWS; row += 1) {
			for (let col = 0; col < GameConfig.REELS; col += 1) {
				const highlight = this.highlights[row]?.[col];
				if (highlight) {
					highlight.visible = marked.has(`${row},${col}`);
				}

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
