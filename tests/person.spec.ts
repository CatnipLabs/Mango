import { describe, expect, it } from "vitest";
import { Random } from "../src/core/random";
import { pt_BR } from "../src/data/locales/pt_BR";
import { firstName, fullName, lastName } from "../src/generators/person";

describe("person", () => {
	it("generates deterministic fullName with seed", () => {
		const a = fullName(new Random(42), pt_BR);
		const b = fullName(new Random(42), pt_BR);
		expect(a).toBe(b);
	});
	it("firstName is deterministic with seed", () => {
		const a = firstName(new Random(1234), pt_BR);
		const b = firstName(new Random(1234), pt_BR);
		expect(a).toBe(b);
		// Belongs to the locale's firstNames set
		expect(pt_BR.person.firstNames).toContain(a);
	});
	it("lastName is deterministic with seed", () => {
		const a = lastName(new Random(5678), pt_BR);
		const b = lastName(new Random(5678), pt_BR);
		expect(a).toBe(b);
		// Belongs to the locale's lastNames set
		expect(pt_BR.person.lastNames).toContain(a);
	});
	it("fullName is composed of valid firstName and lastName", () => {
		const rng = new Random(99);
		const fn = firstName(rng, pt_BR);
		const ln = lastName(rng, pt_BR);
		const full = `${fn} ${ln}`;
		expect(full).toBeTypeOf("string");
		expect(full.split(" ").length).toBe(2);
		expect(pt_BR.person.firstNames).toContain(fn);
		expect(pt_BR.person.lastNames).toContain(ln);
	});
});
