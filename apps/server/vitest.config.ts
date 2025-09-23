import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		globals: true,
		coverage: {
			provider: 'istanbul', // <--- use 'istanbul' or 'v8'
			reporter: ['text', 'lcov', 'html'],
			exclude: ['node_modules/', 'test/', 'dist/'],
		},
		poolOptions: {
			forks: {
				execArgv: ["--expose-gc"],
			},
		},
	},
});