import { Container } from 'pixi.js';
import ReelSet from '../reels/ReelSet';
import WinCalculator from '../paylines/WinCalculator';
import ReelsView from '../reels/ReelsView';
import SpinButton from '../button/SpinButton';
import WinText from './WinText';
import BettingLayout from '../bets/BettingLayout';

const PAD = 32;
const SECTION = 28;
const REELS_TO_BUTTON = 48;
const WIN_H = 160;

export default class GameScreen extends Container {
	layoutWidth = 800;
	layoutHeight = 700;

	private readonly reelSet = new ReelSet();
	private readonly winCalculator = new WinCalculator();
	private readonly reelsView = new ReelsView();
	private readonly spinButton: SpinButton;
	private readonly winText = new WinText();
	private readonly bettingLayout = new BettingLayout();
	constructor() {
		super();

		this.spinButton = new SpinButton(() => this.onSpin());
		this.addChild(this.spinButton, this.reelsView, this.winText, this.bettingLayout);
		this.refresh();

		window.addEventListener('keydown', this.onKeyDown);
	}

	layoutForViewport(width: number, height: number): void {
		if (width >= height) {
			this.layoutLandscape();
		} else {
			this.layoutPortrait();
		}
	}

	private layoutLandscape(): void {
		const rw = this.reelsView.gridWidth;
		const rh = this.reelsView.gridHeight;
		const btn = this.spinButton.size;

		this.layoutWidth = PAD + rw + SECTION + btn + PAD;
		this.layoutHeight = Math.max(PAD + rh + SECTION + WIN_H + PAD, PAD + btn + PAD);

		this.reelsView.x = PAD;
		this.reelsView.y = Math.max(PAD, (this.layoutHeight - rh - WIN_H) / 2);

		this.spinButton.x = this.reelsView.x + rw + SECTION + this.spinButton.radius;
		this.spinButton.y = this.reelsView.y + rh / 2;

		this.bettingLayout.x = this.reelsView.x + rw + SECTION + 40;
		this.bettingLayout.y = this.reelsView.y + rh - 50;

		this.winText.x = this.reelsView.x + rw / 2;
		this.winText.y = this.reelsView.y + rh + SECTION;
		this.winText.setBounds(rw, WIN_H);
	}

	private layoutPortrait(): void {
		const rw = this.reelsView.gridWidth;
		const rh = this.reelsView.gridHeight;
		const btn = this.spinButton.size;

		this.layoutWidth = Math.max(rw, btn) + PAD * 2;
		this.layoutHeight = PAD + rh + REELS_TO_BUTTON + btn + SECTION + WIN_H + PAD;

		this.reelsView.x = (this.layoutWidth - rw) / 2;
		this.reelsView.y = PAD;

		this.spinButton.x = this.layoutWidth / 2;
		this.spinButton.y = this.reelsView.y + rh + REELS_TO_BUTTON + this.spinButton.radius;

		this.bettingLayout.x = this.layoutWidth / 2 - 70;
		this.bettingLayout.y = this.spinButton.y + this.spinButton.radius + 8;

		this.winText.x = this.layoutWidth / 2;
		this.winText.y = this.spinButton.y + this.spinButton.radius + SECTION;
		this.winText.setBounds(this.layoutWidth - PAD * 2, WIN_H);
	}

	private onKeyDown = (event: KeyboardEvent): void => {
		if (event.code !== 'Space' || event.repeat) {
			return;
		}
		event.preventDefault();
		this.onSpin();
	};

	private onSpin(): void {
		this.reelSet.spin();
		this.refresh();
	}

	private refresh(): void {
		const screen = this.reelSet.getScreen();
		const result = this.winCalculator.calculate(screen, this.bettingLayout.bet);
		this.reelsView.update(screen, result.highlightCells);
		this.winText.setText(result.toDisplayText());
	}
}
