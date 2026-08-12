import { Application, Container } from 'pixi.js';

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

		// await this.runPreloader(pixi, root);
	}
}
