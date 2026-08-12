import { Application, Text } from 'pixi.js';

async function main(): Promise<void> {
	const app = new Application();

	await app.init({
		resizeTo: window,
		background: '0x4a2c6a',
		antialias: true,
	});

	const container = document.getElementById('app');
	if (!container) {
		throw new Error('Missing app????');
	}

	container.appendChild(app.canvas);

	const title = new Text({
		text: 'Helllloooooooo',
		style: {
			fill: 0xffffff,
			fontSize: 32,
			fontFamily: 'Arial',
		},
	});

	title.anchor.set(0.5);
	title.x = app.screen.width / 2;
	title.y = app.screen.height / 2;
	app.stage.addChild(title);

	window.addEventListener('resize', () => {
		title.x = app.screen.width / 2;
		title.y = app.screen.height / 2;
	});
}

main().catch((error: unknown) => {
	console.error('Failed to start the app:', error);
});

