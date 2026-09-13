import { Container, Assets, Graphics, Text } from 'pixi.js';
import GameConfig from '../config/GameConfig';
import Theme from '../config/Theme';

const BAR_WIDTH = 280;
const BAR_HEIGHT = 14;
export default class Preloader extends Container {
	private readonly title: Text;
	private readonly percentText: Text;
	private readonly barBackground: Graphics;
	private readonly barFill: Graphics;
	private readonly tapToContinue: Text;
	private pulseRaf = 0;
	private onWindowTap: (() => void) | null = null;

	constructor() {
		super();

		this.title = new Text({
			text: 'Loading...',
			style: {
				fontFamily: 'Arial',
				fontSize: 28,
				fill: Theme.TEXT_MUTED,
			},
		});
		this.title.anchor.set(0.5);

		this.percentText = new Text({
			text: '0%',
			style: {
				fontFamily: 'Arial',
				fontSize: 54,
				fill: Theme.TEXT,
			},
		});
		this.percentText.anchor.set(0.5);

		this.barBackground = new Graphics()
			.roundRect(-BAR_WIDTH / 2, -BAR_HEIGHT / 2, BAR_WIDTH, BAR_HEIGHT, 7)
			.fill({ color: '#ffffff', alpha: 0.15 });

		this.barFill = new Graphics();

		this.tapToContinue = new Text({
			text: 'Tap to continue',
			style: {
				fontFamily: 'Arial',
				fontSize: 30,
				fill: Theme.TEXT,
			},
		});
		this.tapToContinue.anchor.set(0.5);
		this.tapToContinue.visible = false;

		this.addChild(this.title, this.percentText, this.barBackground, this.barFill, this.tapToContinue);
		this.alpha = 0;
	}

	layoutSettings(width: number, height: number) {
		const offX = width / 2;
		const offY = height / 2;

		this.title.position.set(offX, offY - 70);
		this.percentText.position.set(offX, offY);
		this.barBackground.position.set(offX, offY + 55);
		this.barFill.position.set(offX, offY + 55);
		this.tapToContinue.position.set(offX, offY + 150);
	}

	async run() {
		await this.fade(1, 300);

		await Assets.load(GameConfig.getAllAssetPaths(), (progress) => {
			this.setProgress(progress);
		});

		this.setProgress(1);
		this.startTapPulse();
		await this.waitForTap();
		await this.fade(0, 300);
	}

	private waitForTap(): Promise<void> {
		return new Promise((resolve) => {
			this.onWindowTap = (): void => {
				this.onWindowTap = null;
				this.stopTapPulse();
				resolve();
			};
			window.addEventListener('pointerdown', this.onWindowTap, { once: true });
		});
	}

	private startTapPulse(): void {
		this.tapToContinue.visible = true;

		let from = 1;
		let to = 0.2;
		let startedAt = performance.now();

		const tick = (): void => {
			const t = Math.min(1, (performance.now() - startedAt) / 500);
			this.tapToContinue.alpha = from + (to - from) * t;

			if (t >= 1) {
				const next = from;
				from = to;
				to = next;
				startedAt = performance.now();
			}

			this.pulseRaf = requestAnimationFrame(tick);
		};

		this.pulseRaf = requestAnimationFrame(tick);
	}

	private stopTapPulse(): void {
		cancelAnimationFrame(this.pulseRaf);
	}

	private setProgress(progress: number): void {
		const percent = Math.round(progress * 100);
		this.percentText.text = `${percent}%`;

		this.barFill.clear();
		const width = BAR_WIDTH * progress;
		if (width > 0) {
			this.barFill.roundRect(-BAR_WIDTH / 2, -BAR_HEIGHT / 2, width, BAR_HEIGHT, 7).fill(Theme.GOLD);
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

	override destroy(options?: Parameters<Container['destroy']>[0]): void {
		if (this.onWindowTap) {
			window.removeEventListener('pointerdown', this.onWindowTap);
			this.onWindowTap = null;
		}
		this.stopTapPulse();
		super.destroy(options);
	}
}
