import GameConfig from '../config/GameConfig';
import type { MatchCount, Screen, SymbolId } from '../config/types';
import type { LineWin } from './LineWin';

export default class Payline {
	constructor(
		readonly id: number,
		readonly rows: readonly number[],
	) {}

	evaluate(screen: Screen, bet = 1): LineWin | null {
		const symbols: SymbolId[] = [];

		for (let col = 0; col < this.rows.length; col += 1) {
			const row = this.rows[col];
			if (row === undefined) {
				throw new Error(`Payline ${this.id} is missing row for column ${col}`);
			}

			const symbol = screen[row]?.[col];
			if (!symbol) {
				throw new Error(`Missing symbol on payline ${this.id} at row ${row}, col ${col}`);
			}

			symbols.push(symbol);
		}

		const matchCount = this.countLeftToRightMatch(symbols);

		if (matchCount < 3) {
			return null;
		}

		const counted = matchCount as MatchCount;
		const symbolId = symbols[0];
		if (!symbolId) {
			return null;
		}

		return {
			paylineId: this.id,
			symbolId,
			matchCount: counted,
			payout: GameConfig.PAYTABLE[symbolId][counted] * bet,
		};
	}

	private countLeftToRightMatch(symbols: SymbolId[]): number {
		if (symbols.length === 0) {
			return 0;
		}

		const first = symbols[0];
		if (!first) {
			return 0;
		}

		let count = 1;

		for (let i = 1; i < symbols.length; i += 1) {
			if (symbols[i] !== first) {
				break;
			}
			count += 1;
		}

		return count;
	}
}
