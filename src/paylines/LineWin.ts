import type { MatchCount, SymbolId } from '../config/types';

export type LineWin = {
	paylineId: number;
	symbolId: SymbolId;
	matchCount: MatchCount;
	payout: number;
};
