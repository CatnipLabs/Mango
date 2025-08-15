import { describe, expect, it } from "vitest";
import { Random } from "../src/core/random";
import { en_US } from "../src/data/locales/en_US";
import { pt_BR } from "../src/data/locales/pt_BR";
import {
	city,
	fullAddress,
	state,
	street,
	streetNumber,
	zip,
} from "../src/generators/address";

describe("address", () => {
	it("deterministic street with seed", () => {
		const a = street(new Random(1), pt_BR);
		const b = street(new Random(1), pt_BR);
		expect(a).toBe(b);
	});
	it("streetNumber within range", () => {
		const n = streetNumber(new Random(2), en_US);
		expect(n).toBeGreaterThanOrEqual(1);
		expect(n).toBeLessThanOrEqual(9999);
	});
	it("zip format matches pattern", () => {
		const z1 = zip(new Random(3), en_US);
		expect(z1).toMatch(/^\d{5}$/);
		const z2 = zip(new Random(4), pt_BR);
		expect(z2).toMatch(/^\d{5}-\d{3}$/);
	});
	it("fullAddress composes expected shape", () => {
		const f = fullAddress(new Random(5), en_US);
		expect(f).toMatch(/\d+ .+, .+, [A-Z]{2} \d{5}/);
	});
	it("city/state are from locale lists", () => {
		const rng = new Random(6);
		const c = city(rng, pt_BR);
		const s = state(rng, pt_BR);
		expect(pt_BR.address.cities).toContain(c);
		expect(pt_BR.address.states.map((x) => x.code)).toContain(s.code);
	});
});
