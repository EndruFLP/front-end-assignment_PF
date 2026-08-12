import { Container, Assets, Graphics, Text } from 'pixi.js';
import { GameConfig } from '../config/GameConfig';

const BAR_WIDTH = 280;
const BAR_HEIGHT = 14;

export default class Preloader extends Container {
	private readonly title: Text;
	private readonly percentText: Text;
	private readonly barBackground: Graphics;
	private readonly barFill: Graphics;

	constructor() {
		super();

		this.title = new Text({
			text: 'Loading...',
			style: {
				fontFamily: 'Arial',
				fontSize: 28,
				fill: '#b8c0d0',
			},
		});
		this.title.anchor.set(0.5);

		this.percentText = new Text({
			text: '0%',
			style: {
				fontFamily: 'Arial',
				fontSize: 54,
				fill: '#ffffff',
			},
		});
		this.percentText.anchor.set(0.5);

		this.barBackground = new Graphics()
			.roundRect(-BAR_WIDTH / 2, -BAR_HEIGHT / 2, BAR_WIDTH, BAR_HEIGHT, 7)
			.fill({ color: '#ffffff', alpha: 0.15 });

		this.barFill = new Graphics();

		this.addChild(this.title, this.percentText, this.barBackground, this.barFill);
		this.alpha = 0;
	}

	//centrari
	layoutSettings(width: number, height: number) {
		const offX = width / 2;
		const offY = height / 2;

		this.title.position.set(offX, offY - 70);
		this.percentText.position.set(offX, offY);
		this.barBackground.position.set(offX, offY + 55);
		this.barFill.position.set(offX, offY + 55);
	}

	async run() {
		await this.fade(1, 300);

		await Assets.load(GameConfig.getAllAssetPaths(), (progress) => {
			this.setProgress(progress);
		});

		this.setProgress(1);
		await this.wait(1200);
		await this.fade(0, 300);
	}

	private setProgress(progress: number): void {
		const percent = Math.round(progress * 100);
		this.percentText.text = `${percent}%`;

		this.barFill.clear();
		const width = BAR_WIDTH * progress;
		if (width > 0) {
			this.barFill.roundRect(-BAR_WIDTH / 2, -BAR_HEIGHT / 2, width, BAR_HEIGHT, 7).fill({ color: '#f5d76e' });
		}
	}

	private fade(targetAlpha: number, durationMs: number): Promise<void> {
		return new Promise((resolve) => {
			const startAlpha = this.alpha;
			const startTime = performance.now();

			const tick = (): void => {
				const elapsed = performance.now() - startTime;
				const t = Math.min(1, elapsed / durationMs);
				this.alpha = startAlpha + (targetAlpha - startAlpha) * t;

				if (t < 1) {
					requestAnimationFrame(tick);
				} else {
					this.alpha = targetAlpha;
					resolve();
				}
			};

			requestAnimationFrame(tick);
		});
	}

	private wait(ms: number): Promise<void> {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}
}
