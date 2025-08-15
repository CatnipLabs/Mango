import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["src/index.ts"],
	dts: true,
	format: ["esm", "cjs"],
	outExtension: ({ format }) => ({ js: format === "esm" ? ".mjs" : ".cjs" }),
	sourcemap: true,
	clean: true,
	target: "es2020",
	minify: false,
});
