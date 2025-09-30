import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		globals: true,
		maxConcurrency: 1, // one test at a time
		fileParallelism: false, // one test file at a time
		exclude: ["node_modules", "dist"],
		coverage: {
			provider: "istanbul",
			reporter: ["text", "lcov", "html"],
			exclude: ["node_modules/", "test/", "dist/"],
		},
	},
});
