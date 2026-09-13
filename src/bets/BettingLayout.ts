import { Container, Text } from 'pixi.js';
import GameConfig from '../config/GameConfig';
import StepButton from '../button/StepButton';

const BTN = 40;
const GAP = 12;

export default class BettingLayout extends Container {
	private betIndex = 0;
	private readonly betText: Text;
	private readonly minusButton: StepButton;
	private readonly plusButton: StepButton;

	constructor() {
		super();

		this.minusButton = new StepButton('-', () => this.changeBet(-1));
		this.plusButton = new StepButton('+', () => this.changeBet(1));

		this.betText = new Text({
			text: '',
			style: {
				fontFamily: 'Arial, sans-serif',
				fontSize: 20,
				fill: 0xffffff,
			},
		});
		this.betText.anchor.set(0.5);

		this.minusButton.x = 0;
		this.betText.x = BTN / 2 + GAP + 36;
		this.plusButton.x = this.betText.x + 36 + GAP + BTN / 2;

		this.addChild(this.minusButton, this.betText, this.plusButton);
		this.refreshLabel();
		this.refreshButtons();
	}

	get bet(): number {
		return GameConfig.BET_LEVELS[this.betIndex] ?? GameConfig.BET_LEVELS[0]!;
	}

	private changeBet(step: number): void {
		const next = this.betIndex + step;

		//small check to prevent negative bets or bets greater than max bet
		if (next < 0 || next >= GameConfig.BET_LEVELS.length) {
			return;
		}

		this.betIndex = next;
		this.refreshLabel();
		this.refreshButtons();
	}

	private refreshLabel(): void {
		this.betText.text = `Bet ${this.bet}`;
	}

	private refreshButtons(): void {
		if (this.betIndex <= 0) {
			this.minusButton.disableButton();
		} else {
			this.minusButton.enableButton();
		}

		if (this.betIndex >= GameConfig.BET_LEVELS.length - 1) {
			this.plusButton.disableButton();
		} else {
			this.plusButton.enableButton();
		}
	}
}
