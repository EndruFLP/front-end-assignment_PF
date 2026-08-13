import { Application, Container } from 'pixi.js';
import Preloader from './ui/Preloader';
import GameScreen from './ui/GameScreen';

export default class App {
	async start(host: HTMLElement) {
		const pixi = new Application();
		await pixi.init({
			resizeTo: window,
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
		window.addEventListener('resize', onResize);

		await preloader.run();

		window.removeEventListener('resize', onResize);
		root.removeChild(preloader);
		preloader.destroy({ children: true });
	}

	private showGame(pixi: Application, root: Container): void {
		const game = new GameScreen();
		root.addChild(game);

		const layoutGame = (): void => {
			game.layoutForViewport(pixi.screen.width, pixi.screen.height);

			const scale = Math.min(pixi.screen.width / game.layoutWidth, pixi.screen.height / game.layoutHeight);

			game.scale.set(scale);
			game.x = (pixi.screen.width - game.layoutWidth * scale) / 2;
			game.y = (pixi.screen.height - game.layoutHeight * scale) / 2;
		};

		layoutGame();
		window.addEventListener('resize', layoutGame);
	}
}
