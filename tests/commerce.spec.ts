import { describe, expect, it } from "vitest";
import { Random } from "../src/core/random";
import { en_US } from "../src/data/locales/en_US";
import {
	category,
	price,
	priceWithCurrency,
	productName,
} from "../src/generators/commerce";

describe("commerce", () => {
	it("category and productName come from lists", () => {
		const cat = category(new Random(13), en_US);
		const prod = productName(new Random(14), en_US);
		expect(en_US.commerce.categories).toContain(cat);
		expect(en_US.commerce.productNames).toContain(prod);
	});
	it("price within bounds and decimals", () => {
		const rng = new Random(15);
		const p = price(rng, en_US, { min: 10, max: 20, decimals: 2 });
		expect(p).toBeGreaterThanOrEqual(10);
		expect(p).toBeLessThanOrEqual(20);
		expect(Number.isInteger(Math.round(p * 100))).toBe(true);
	});
	it("priceWithCurrency includes currency when provided", () => {
		const out = priceWithCurrency(new Random(16), en_US);
		expect(out.currency).toBe(en_US.commerce.currency);
		expect(typeof out.amount).toBe("number");
	});
});
