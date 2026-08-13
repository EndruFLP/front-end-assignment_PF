import GameConfig from '../config/GameConfig';
import Reel from './Reel';
import type { SymbolId, Screen } from '../config/types';

export default class ReelSet {
	private readonly reels: Reel[];

	constructor(bands: readonly SymbolId[][] = GameConfig.REEL_BANDS) {
		this.reels = bands.map((band) => new Reel(band));
		this.setPositions([...GameConfig.INITIAL_POS]);
	}

	getPositions(): number[] {
		return this.reels.map((reel) => reel.getPosition());
	}

	setPositions(positions: number[]) {
		if (positions.length !== this.reels.length) {
			throw new Error(`Expected ${this.reels.length} reel positions, got ${positions.length}`);
		}
		positions.forEach((position, index) => {
			this.reels[index]!.setPosition(position);
		});
	}

	spin() {
		this.reels.forEach((reel) => reel.spinRandom());
	}

	// tabla 3x5
	getScreen(): Screen {
		const columns = this.reels.map((reel) => reel.getVisibleSymbols());
		return Array.from({ length: GameConfig.ROWS }, (_, row) => columns.map((column) => column[row]!));
	}
}
