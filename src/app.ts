import { Application, Container } from 'pixi.js';
import Preloader from './ui/Preloader';
import GameScreen from './ui/GameScreen';

export default class App {
	async start(host: HTMLElement) {
		const pixi = new Application();
		await pixi.init({
			resizeTo: window,
			autoDensity: true,
			resolution: Math.min(window.devicePixelRatio || 1, 2),
			background: 'rebeccapurple',
			antialias: true,
		});

		host.appendChild(pixi.canvas);

		const root = new Container();
		pixi.stage.addChild(root);

		await this.runPreloader(pixi, root);
		this.showGame(pixi, root);
	}

	private async runPreloader(pixi: Application, root: Container) {
		const preloader = new Preloader();
		root.addChild(preloader);
		preloader.layoutSettings(pixi.screen.width, pixi.screen.height);

		const onResize = (): void => {
			preloader.layoutSettings(pixi.screen.width, pixi.screen.height);
		};
		pixi.renderer.on('resize', onResize);

		await preloader.run();

		pixi.renderer.off('resize', onResize);
		root.removeChild(preloader);
		preloader.destroy({ children: true });
	}

	private showGame(pixi: Application, root: Container): void {
		const game = new GameScreen();
		root.addChild(game);

		let rafId = 0;

		const layoutGame = (): void => {
			const { width, height } = pixi.screen;

			game.layoutForViewport(width, height);

			const scale = Math.min(width / game.layoutWidth, height / game.layoutHeight);

			game.scale.set(scale);
			game.x = (width - game.layoutWidth * scale) / 2;
			game.y = (height - game.layoutHeight * scale) / 2;
		};

		const scheduleLayout = (): void => {
			cancelAnimationFrame(rafId);
			rafId = requestAnimationFrame(() => {
				requestAnimationFrame(layoutGame);
			});
		};

		layoutGame();

		pixi.renderer.on('resize', scheduleLayout);

		window.addEventListener('orientationchange', () => {
			window.setTimeout(scheduleLayout, 100);
			window.setTimeout(scheduleLayout, 300);
		});
	}
}
