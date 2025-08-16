import { describe, expect, it } from "vitest";
import { Random } from "../src/core/random";
import {
	nanoid,
	objectId,
	shortUUID,
	ulid,
	uuidV4,
} from "../src/generators/ids";

const uuidRe =
	/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
const ulidRe = /^[0-9A-HJKMNP-TV-Z]{26}$/; // Crockford32, no I L O U
const hex24 = /^[0-9a-f]{24}$/;
const urlSafe = /^[A-Za-z0-9_-]+$/;
const base58 =
	/^[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]+$/;

describe("ids", () => {
	it("uuidV4", () => {
		const id = uuidV4(new Random(1));
		expect(uuidRe.test(id)).toBe(true);
	});
	it("ulid", () => {
		const id = ulid(new Random(2));
		expect(id).toHaveLength(26);
		expect(ulidRe.test(id)).toBe(true);
	});
	it("nanoid default length and alphabet", () => {
		const id = nanoid(new Random(3));
		expect(id).toHaveLength(21);
		expect(urlSafe.test(id)).toBe(true);
	});
	it("objectId 24 hex chars", () => {
		const id = objectId(new Random(4));
		expect(hex24.test(id)).toBe(true);
	});
	it("shortUUID base58", () => {
		const id = shortUUID(new Random(5));
		expect(id.length).toBeGreaterThanOrEqual(20);
		expect(id.length).toBeLessThanOrEqual(24);
		expect(base58.test(id)).toBe(true);
	});
});
