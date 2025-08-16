import type { Random } from "../core/random";

/**
 * Generate a RFC 4122 version 4 UUID string.
 */
export function uuidV4(rng: Random): string {
	// Generate 16 random bytes, set version and variant bits
	const bytes = new Uint8Array(16);
	for (let i = 0; i < 16; i++) bytes[i] = rng.int(0, 255);
	bytes[6] = (bytes[6] & 0x0f) | 0x40; // version 4
	bytes[8] = (bytes[8] & 0x3f) | 0x80; // variant 10
	const toHex = (n: number) => n.toString(16).padStart(2, "0");
	const hex = Array.from(bytes, toHex).join("");
	return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(
		12,
		16,
	)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

// Crockford's Base32 alphabet for ULID
const CROCKFORD32 = "0123456789ABCDEFGHJKMNPQRSTVWXYZ" as const;

/**
 * ULID (Universally Unique Lexicographically Sortable Identifier)
 * Deterministic by default (timestamp synthesized from rng unless provided).
 */
export function ulid(rng: Random, opts?: { time?: number }): string {
	// 48-bit timestamp in ms
	let time = opts?.time;
	if (time === undefined) {
		// Synthesize a 48-bit timestamp from RNG to keep determinism by default
		const high = rng.int(0, 0xffff); // 16 bits
		const low = rng.int(0, 0xffffffff) >>> 0; // 32 bits
		time = (high * 0x1_0000_0000 + low) % (2 ** 48); // properly constrained to 48 bits
	}
	// clamp to 48 bits
	time = Math.max(0, Math.floor(time)) % 2 ** 48;

	// 80 bits random component (10 bytes)
	const rand = new Uint8Array(10);
	for (let i = 0; i < 10; i++) rand[i] = rng.int(0, 255);

	// Build a 128-bit bitstring: 48 (time) + 80 (random)
	const timeBits = time.toString(2).padStart(48, "0");
	let randBits = "";
	for (let i = 0; i < rand.length; i++)
		randBits += rand[i].toString(2).padStart(8, "0");
	const bits = timeBits + randBits; // 128 bits

	// Encode 26 chars of 5-bit groups (pad the last group with zeros)
	let out = "";
	for (let i = 0; i < 26; i++) {
		const start = i * 5;
		const chunk = bits.slice(start, start + 5).padEnd(5, "0");
		const idx = parseInt(chunk, 2);
		out += CROCKFORD32[idx];
	}
	return out;
}

/** nanoid-like URL-safe ID (default length 21). */
export function nanoid(
	rng: Random,
	opts?: { length?: number; alphabet?: string },
): string {
	const length = Math.max(1, Math.floor(opts?.length ?? 21));
	const alphabet =
		opts?.alphabet ??
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
	let out = "";
	for (let i = 0; i < length; i++)
		out += alphabet[rng.int(0, alphabet.length - 1)];
	return out;
}

/** MongoDB-like ObjectId: 12-byte hex string (24 chars). Deterministic by default. */
export function objectId(rng: Random, opts?: { time?: number }): string {
	const bytes = new Uint8Array(12);
	// 4-byte timestamp (big-endian). If not provided, synthesize deterministically from rng.
	let t = opts?.time;
	if (t === undefined) t = rng.int(0, 0xffffffff) >>> 0;
	bytes[0] = (t >>> 24) & 0xff;
	bytes[1] = (t >>> 16) & 0xff;
	bytes[2] = (t >>> 8) & 0xff;
	bytes[3] = t & 0xff;
	// remaining 8 bytes random
	for (let i = 4; i < 12; i++) bytes[i] = rng.int(0, 255);
	const toHex = (n: number) => n.toString(16).padStart(2, "0");
	return Array.from(bytes, toHex).join("");
}

// Base58 alphabet without 0 O I l
const BASE58 =
	"123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz" as const;
function toBase58(bytes: Uint8Array): string {
	// Convert big-endian bytes to BigInt
	let value = 0n;
	for (const b of bytes) value = (value << 8n) + BigInt(b);
	let out = "";
	while (value > 0n) {
		const rem = Number(value % 58n);
		out = BASE58[rem] + out;
		value = value / 58n;
	}
	// Preserve leading zero bytes as '1' characters
	for (const b of bytes) {
		if (b === 0) out = BASE58[0] + out;
		else break;
	}
	return out || BASE58[0];
}

/** A compact base58-encoded UUIDv4 (typically ~22 chars). */
export function shortUUID(rng: Random): string {
	const bytes = new Uint8Array(16);
	for (let i = 0; i < 16; i++) bytes[i] = rng.int(0, 255);
	bytes[6] = (bytes[6] & 0x0f) | 0x40; // v4
	bytes[8] = (bytes[8] & 0x3f) | 0x80; // variant
	return toBase58(bytes);
}
