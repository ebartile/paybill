import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
	rollup: {
		emitCJS: true,
		esbuild: {
			treeShaking: true,
		},
	},
	declaration: true,
	outDir: "dist",
	clean: true,
	failOnWarn: false,
    externals: [
    ],
	entries: [
		"./src/index.ts",
	],
});