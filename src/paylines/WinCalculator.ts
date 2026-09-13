import GameConfig from '../config/GameConfig';
import type { Screen } from '../config/types';
import type { LineWin } from './LineWin';
import Payline from './Payline';
import WinResult from './WinResult.ts';
export default class WinCalculator {
	private readonly paylines: Payline[] = [];

	constructor() {
		for (const paylineConfig of GameConfig.PAYLINES) {
			this.paylines.push(new Payline(paylineConfig.id, paylineConfig.rows));
		}
	}

	calculate(screen: Screen, bet = 1): WinResult {
		const lineWins: LineWin[] = [];
		let totalWins = 0;

		for (const payline of this.paylines) {
			const win = payline.evaluate(screen, bet);

			if (win !== null) {
				lineWins.push(win);
				totalWins += win.payout;
			}
		}

		return new WinResult(totalWins, lineWins);
	}
}
