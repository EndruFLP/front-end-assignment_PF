import { Application, Container } from 'pixi.js';
import Preloader from './ui/Preloader';

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
}
