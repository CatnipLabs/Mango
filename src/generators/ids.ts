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
		time = (high * 0x1_0000_0000 + low) % 2 ** 48; // properly constrained to 48 bits
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

// Numeric ID helpers (PostgreSQL-like ranges)

/** smallint: 2-byte integer. Defaults to unsigned [0..32767] for ID usage. */
export function smallInt(
	rng: Random,
	opts?: { signed?: boolean; min?: number; max?: number },
): number {
	const signed = opts?.signed ?? false;
	const defaultMin = signed ? -32768 : 0;
	const defaultMax = signed ? 32767 : 32767;
	const min = Math.floor(opts?.min ?? defaultMin);
	const max = Math.floor(opts?.max ?? defaultMax);
	return rng.int(Math.min(min, max), Math.max(min, max));
}

/** integer: 4-byte integer. Defaults to unsigned [0..2147483647] for ID usage. */
export function integer(
	rng: Random,
	opts?: { signed?: boolean; min?: number; max?: number },
): number {
	const signed = opts?.signed ?? false;
	const I32_MAX = 0x7fffffff; // 2147483647
	const I32_MIN = -0x80000000; // -2147483648
	const defaultMin = signed ? I32_MIN : 0;
	const defaultMax = signed ? I32_MAX : I32_MAX;
	const min = Math.trunc(opts?.min ?? defaultMin);
	const max = Math.trunc(opts?.max ?? defaultMax);
	return rng.int(Math.min(min, max), Math.max(min, max));
}

/** bigint: 8-byte integer as BigInt. Defaults to unsigned [1..2^63-1] for IDs. */
export function bigInteger(
	rng: Random,
	opts?: { min?: bigint | number; max?: bigint | number },
): bigint {
	const MAX = (1n << 63n) - 1n; // 9223372036854775807
	const rawMin = opts?.min ?? 1n;
	const rawMax = opts?.max ?? MAX;
	const min = typeof rawMin === "number" ? BigInt(Math.trunc(rawMin)) : rawMin;
	const max = typeof rawMax === "number" ? BigInt(Math.trunc(rawMax)) : rawMax;
	// 64-bit random value
	const bytes = new Uint8Array(8);
	for (let i = 0; i < 8; i++) bytes[i] = rng.int(0, 255);
	let val = 0n;
	for (const b of bytes) val = (val << 8n) + BigInt(b);
	const range = max >= min ? max - min + 1n : min - max + 1n;
	const base = min <= max ? min : max;
	return base + (val % range);
}

/** serial types are positive-only sequences; we emulate by returning a valid range value. */
export function smallSerial(rng: Random): number {
	return smallInt(rng, { signed: false, min: 1, max: 32767 });
}
export function serial(rng: Random): number {
	return integer(rng, { signed: false, min: 1, max: 0x7fffffff });
}
export function bigSerial(rng: Random): bigint {
	return bigInteger(rng, { min: 1n });
}

/** identity: GENERATED {ALWAYS|BY DEFAULT} AS IDENTITY value generator */
export function identity(
	rng: Random,
	opts?: {
		mode?: "ALWAYS" | "BY DEFAULT";
		type?: "smallint" | "integer" | "bigint";
	},
): number | bigint {
	const t = opts?.type ?? "integer";
	if (t === "smallint") return smallSerial(rng);
	if (t === "bigint") return bigSerial(rng);
	return serial(rng);
}

/**
 * CUID (classic): 'c' + base36 timestamp + random block.
 * Not cryptographically secure; deterministic via rng.
 */
export function cuid(rng: Random, opts?: { length?: number }): string {
	const ts = Math.max(0, Math.trunc(Date.now())).toString(36);
	const len = Math.max(8, Math.trunc(opts?.length ?? 16));
	const alphabet = "abcdefghijklmnopqrstuvwxyz0123456789";
	let rand = "";
	for (let i = 0; i < len; i++)
		rand += alphabet[rng.int(0, alphabet.length - 1)];
	return `c${ts}${rand}`;
}
