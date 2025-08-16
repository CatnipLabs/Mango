import { describe, expect, it } from "vitest";
import { pt_BR } from "../src/data/locales/pt_BR";
import { Mango } from "../src/index";
import { definePlugin } from "../src/plugins/types";

const echoPlugin = definePlugin({
	name: "echo",
	install(ctx) {
		return {
			localeCode: () => ctx.getLocale().address.states[0]?.code ?? "",
			reseed: (seed: number) => ctx.rng.seed(seed),
			setPtBR: () => ctx.setLocale(pt_BR),
		};
	},
});

describe("plugins", () => {
	it("registers and exposes plugin API", () => {
		const mango = new Mango();
		mango.use(echoPlugin);
		const api = mango.plugin(echoPlugin);
		expect(typeof api.localeCode).toBe("function");
	});

	it("can modify seed and locale via context", () => {
		const mango = new Mango();
		mango.use(echoPlugin);
		const api = mango.plugin(echoPlugin);
		api.reseed(1234);
		api.setPtBR();
		expect(mango.internet.email()).toBeTypeOf("string");
	});
});
