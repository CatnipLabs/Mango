import { describe, expect, it } from "vitest";
import { Random } from "../src/core/random";
import { between, recent, soon } from "../src/generators/date";

describe("date", () => {
	it("between within the specified range", () => {
		const start = new Date("2024-01-01T00:00:00Z");
		const end = new Date("2024-12-31T23:59:59Z");
		const d = between(new Random(10), start, end);
		expect(d.getTime()).toBeGreaterThanOrEqual(start.getTime());
		expect(d.getTime()).toBeLessThanOrEqual(end.getTime());
	});
	it("recent within last N days", () => {
		const now = Date.now();
		const d = recent(new Random(11), 7);
		expect(d.getTime()).toBeLessThanOrEqual(now);
		expect(d.getTime()).toBeGreaterThanOrEqual(now - 7 * 24 * 3600 * 1000);
	});
	it("soon within next N days", () => {
		const now = Date.now();
		const d = soon(new Random(12), 7);
		expect(d.getTime()).toBeGreaterThanOrEqual(now);
		expect(d.getTime()).toBeLessThanOrEqual(now + 7 * 24 * 3600 * 1000);
	});
});
