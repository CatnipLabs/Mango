import { describe, expect, it } from "vitest";
import { Mango } from "../src";

describe("ids numeric & cuid", () => {
	const m = new Mango({ seed: 123 });

	it("smallInt within signed range by default", () => {
		for (let i = 0; i < 100; i++) {
			const v = m.ids.smallInt();
			expect(v).toBeTypeOf("number");
			expect(v).toBeGreaterThanOrEqual(-32768);
			expect(v).toBeLessThanOrEqual(32767);
		}
	});

	it("smallInt unsigned option respected", () => {
		for (let i = 0; i < 100; i++) {
			const v = m.ids.smallInt({ signed: false });
			expect(v).toBeGreaterThanOrEqual(0);
			expect(v).toBeLessThanOrEqual(65535);
		}
	});

	it("integer within signed 32-bit range by default", () => {
		for (let i = 0; i < 100; i++) {
			const v = m.ids.integer();
			expect(v).toBeGreaterThanOrEqual(-2147483648);
			expect(v).toBeLessThanOrEqual(2147483647);
		}
	});

	it("integer custom min/max respected", () => {
		for (let i = 0; i < 50; i++) {
			const v = m.ids.integer({ min: 10, max: 20 });
			expect(v).toBeGreaterThanOrEqual(10);
			expect(v).toBeLessThanOrEqual(20);
		}
	});

	it("bigInteger returns bigint within bounds", () => {
		for (let i = 0; i < 50; i++) {
			const v = m.ids.bigInteger({ min: 0n, max: 1000n });
			expect(typeof v === "bigint").toBe(true);
			expect(v >= 0n && v <= 1000n).toBe(true);
		}
	});

	it("serial types are positive and within respective ranges", () => {
		for (let i = 0; i < 50; i++) {
			const s = m.ids.smallSerial();
			const i32 = m.ids.serial();
			const b = m.ids.bigSerial();
			expect(s).toBeGreaterThanOrEqual(1);
			expect(s).toBeLessThanOrEqual(32767);
			expect(i32).toBeGreaterThanOrEqual(1);
			expect(i32).toBeLessThanOrEqual(2147483647);
			expect(typeof b === "bigint").toBe(true);
			expect(b >= 1n).toBe(true);
		}
	});

	it("identity returns appropriate type and range", () => {
		for (let i = 0; i < 20; i++) {
			const s = m.ids.identity({ type: "smallint" });
			expect(typeof s).toBe("number");
			expect(s).toBeGreaterThanOrEqual(1);
			expect(s).toBeLessThanOrEqual(32767);

			const i32 = m.ids.identity({ type: "integer" });
			expect(typeof i32).toBe("number");
			expect(i32).toBeGreaterThanOrEqual(1);
			expect(i32).toBeLessThanOrEqual(2147483647);

			const b = m.ids.identity({ type: "bigint" });
			expect(typeof b === "bigint").toBe(true);
			expect(b >= 1n).toBe(true);
		}
	});

	it("cuid looks like a CUID (starts with c, length >= 10)", () => {
		for (let i = 0; i < 20; i++) {
			const id = m.ids.cuid();
			expect(id.startsWith("c")).toBe(true);
			expect(id.length).toBeGreaterThanOrEqual(10);
			expect(/^[a-z0-9]+$/i.test(id)).toBe(true);
		}
	});
});
