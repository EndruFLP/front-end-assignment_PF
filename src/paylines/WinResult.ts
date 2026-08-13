import type { LineWin } from './LineWin';

//totalul de sub tabla
export default class WinResult {
	constructor(
		readonly totalWins: number,
		readonly lineWins: readonly LineWin[],
	) {}

	toDisplayText(): string {
		const lines = [`Total wins: ${this.totalWins}`];

		for (const win of this.lineWins) {
			lines.push(`- payline ${win.paylineId}, ${win.symbolId} x${win.matchCount}, ${win.payout}`);
		}

		return lines.join('\n');
	}
}
