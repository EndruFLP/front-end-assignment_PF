import type { Cell } from '../config/types';
import type { LineWin } from './LineWin';

export default class WinResult {
	constructor(
		readonly totalWins: number,
		readonly lineWins: readonly LineWin[],
		readonly highlightCells: readonly Cell[] = [],
	) {}

	toDisplayText(): string {
		const lines = [`Total wins: ${this.totalWins}`];

		for (const win of this.lineWins) {
			lines.push(`Payline ${win.paylineId}, ${win.symbolId} x${win.matchCount}, ${win.payout}`);
		}

		return lines.join('\n');
	}
}
