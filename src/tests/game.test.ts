import { describe, expect, it } from 'vitest';
import WinCalculator from '../paylines/WinCalculator.ts';
import ReelSet from '../reels/ReelSet.ts';

function makeReels(positions: number[]): ReelSet {
	const reels = new ReelSet();
	reels.setPositions(positions);
	return reels;
}

describe('Screen symbols', () => {
	it('Shows the screen for positions 0,0,0,0,0', () => {
		const reels = makeReels([0, 0, 0, 0, 0]);

		expect(reels.getScreen()).toEqual([
			['hv2', 'hv1', 'lv1', 'hv2', 'lv3'],
			['lv3', 'lv2', 'hv2', 'lv2', 'lv4'],
			['lv3', 'lv3', 'lv3', 'hv3', 'hv2'],
		]);
	});

	it('Shows the screen for positions 18,9,2,0,12', () => {
		const reels = makeReels([18, 9, 2, 0, 12]);

		expect(reels.getScreen()).toEqual([
			['lv3', 'hv4', 'lv3', 'hv2', 'lv2'],
			['hv2', 'lv3', 'lv4', 'lv2', 'hv4'],
			['hv2', 'hv2', 'hv3', 'hv3', 'hv1'],
		]);
	});
});

describe('Payline wins', () => {
	const calculator = new WinCalculator();

	it('Maatches the brief example with total wins 6', () => {
		const screen = makeReels([0, 11, 1, 10, 14]).getScreen();
		const result = calculator.calculate(screen);

		expect(result.totalWins).toBe(6);
		expect(result.lineWins).toEqual([
			{ paylineId: 2, symbolId: 'hv2', matchCount: 3, payout: 5 },
			{ paylineId: 5, symbolId: 'lv3', matchCount: 3, payout: 1 },
		]);
	});

	it('Matches the start positions with total wins 1', () => {
		const screen = makeReels([0, 0, 0, 0, 0]).getScreen();
		const result = calculator.calculate(screen);

		expect(result.totalWins).toBe(1);
		expect(result.lineWins).toEqual([{ paylineId: 3, symbolId: 'lv3', matchCount: 3, payout: 1 }]);
	});

	it('Returns total 0 when there is no winning line', () => {
		const screen = makeReels([18, 9, 2, 0, 12]).getScreen();
		const result = calculator.calculate(screen);

		expect(result.totalWins).toBe(0);
		expect(result.lineWins).toEqual([]);
	});

	it('Matches positions 5,14,9,9,16 from the reel bands', () => {
		const screen = makeReels([5, 14, 9, 9, 16]).getScreen();
		const result = calculator.calculate(screen);

		expect(screen).toEqual([
			['lv1', 'hv1', 'lv1', 'hv1', 'hv1'],
			['hv1', 'lv1', 'hv3', 'lv1', 'lv2'],
			['hv4', 'lv2', 'lv1', 'hv1', 'hv4'],
		]);
		expect(result.totalWins).toBe(5);
		expect(result.lineWins).toEqual([{ paylineId: 6, symbolId: 'lv1', matchCount: 4, payout: 5 }]);
	});

	it('Returns total 0 for positions 1,16,2,15,0', () => {
		const screen = makeReels([1, 16, 2, 15, 0]).getScreen();
		const result = calculator.calculate(screen);

		expect(screen).toEqual([
			['lv3', 'lv2', 'lv3', 'lv3', 'lv3'],
			['lv3', 'lv4', 'lv4', 'hv2', 'lv4'],
			['hv1', 'lv3', 'hv3', 'lv1', 'hv2'],
		]);
		expect(result.totalWins).toBe(0);
		expect(result.lineWins).toEqual([]);
	});
});

describe('Win display text', () => {
	it('Formats total and line details like the brief', () => {
		const screen = makeReels([0, 11, 1, 10, 14]).getScreen();
		const text = new WinCalculator().calculate(screen).toDisplayText();

		expect(text).toBe(['Total wins: 6', '- payline 2, hv2 x3, 5', '- payline 5, lv3 x3, 1'].join('\n'));
	});
});
