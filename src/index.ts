import App from './app.ts';
async function main(): Promise<void> {
	const host = document.getElementById('app');
	if (!host) {
		throw new Error('Missing #app');
	}
	await new App().start(host);
}
main().catch(console.error);

