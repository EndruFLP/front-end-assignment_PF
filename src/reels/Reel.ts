import GameConfig from '../config/GameConfig';
import type { SymbolId } from '../config/types';

export default class Reel {
	private position = 0;

	constructor(private readonly band: readonly SymbolId[]) {
		if (band.length === 0) {
			throw new Error('reel cannot be empty');
		}
	}

	get length(): number {
		return this.band.length;
	}

	getPosition(): number {
		return this.position;
	}

	setPosition(position: number) {
		const length = this.band.length;
		this.position = ((position % length) + length) % length;
	}

	spinRandom() {
		this.position = Math.floor(Math.random() * this.band.length);
	}

	getVisibleSymbols(): SymbolId[] {
		return Array.from({ length: GameConfig.ROWS }, (_, row) => {
			const index = (this.position + row) % this.band.length;
			return this.band[index]!;
		});
	}
}
