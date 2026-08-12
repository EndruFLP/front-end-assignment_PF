import { defineConfig } from 'vitest/config';

export default defineConfig({
	server: {
		open: true,
	},
	publicDir: 'assets',
	test: {
		environment: 'node',
		include: ['src/**/*.test.ts'],
	},
});
