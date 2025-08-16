import { describe, expect, it } from "vitest";
import { Random } from "../src/core/random";
import { en_US } from "../src/data/locales/en_US";
import {
	currencyCode,
	ean13,
	invoiceNumber,
	purchaseOrderNumber,
	quantity,
	sku,
	transactionId,
	upc,
} from "../src/generators/commerce";

const upcRe = /^\d{12}$/;
const ean13Re = /^\d{13}$/;

describe("commerce (extra)", () => {
	it("generates SKU by pattern", () => {
		const s = sku(new Random(1), { pattern: "AAA-####-###" });
		expect(s).toMatch(/^[A-Z]{3}-\d{4}-\d{3}$/);
	});
	it("UPC and EAN-13 have correct length", () => {
		expect(upc(new Random(2))).toMatch(upcRe);
		expect(ean13(new Random(3))).toMatch(ean13Re);
	});
	it("quantity is within bounds", () => {
		const q = quantity(new Random(4), { min: 5, max: 10 });
		expect(q).toBeGreaterThanOrEqual(5);
		expect(q).toBeLessThanOrEqual(10);
	});
	it("PO number and invoice number formats", () => {
		const po = purchaseOrderNumber(new Random(5), { prefix: "PO" });
		const inv = invoiceNumber(new Random(6), { prefix: "INV" });
		expect(po).toMatch(/^PO-[A-Z0-9]{6}-[A-Z0-9]{4}$/);
		expect(inv).toMatch(/^INV-\d{9}$/);
	});
	it("transactionId hex default length", () => {
		const t = transactionId(new Random(7));
		expect(t).toMatch(/^[0-9a-f]{16}$/);
	});
	it("currencyCode from locale", () => {
		expect(currencyCode(en_US)).toBe(en_US.commerce.currency);
	});
});
