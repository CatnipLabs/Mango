import { describe, expect, it } from "vitest";
import { Random } from "../src/core/random";
import { en_US } from "../src/data/locales/en_US";
import { pt_BR } from "../src/data/locales/pt_BR";
import { phone } from "../src/generators/phone";

const brRe = /^\(\d{2}\) 9\d{4}-\d{4}$|^\+55 \d{2} 9\d{4}-\d{4}$/;
const usRe = /^\(\d{3}\) \d{3}-\d{4}$|^\+1-\d{3}-\d{3}-\d{4}$/;

describe("phone", () => {
	it("deterministic with seed", () => {
		const a = phone(new Random(7), pt_BR);
		const b = phone(new Random(7), pt_BR);
		expect(a).toBe(b);
	});
	it("matches locale formats", () => {
		const br = phone(new Random(8), pt_BR);
		expect(brRe.test(br)).toBe(true);
		const us = phone(new Random(9), en_US);
		expect(usRe.test(us)).toBe(true);
	});
});
