import type { Random } from "../core/random";
import type { Locale } from "../types";
import { firstName, lastName } from "./person";

const slug = (s: string) =>
	s
		.toLowerCase()
		.normalize("NFD")
		.replace(/\p{Diacritic}/gu, "")
		.replace(/[^a-z0-9]+/g, ".");

const WORDS = [
	"app",
	"api",
	"dev",
	"stage",
	"internal",
	"portal",
	"services",
	"data",
	"ops",
] as const;
const METHODS = [
	"GET",
	"POST",
	"PUT",
	"PATCH",
	"DELETE",
	"HEAD",
	"OPTIONS",
] as const;
const STATUS: ReadonlyArray<{ code: number; text: string }> = [
	{ code: 200, text: "OK" },
	{ code: 201, text: "Created" },
	{ code: 204, text: "No Content" },
	{ code: 301, text: "Moved Permanently" },
	{ code: 302, text: "Found" },
	{ code: 400, text: "Bad Request" },
	{ code: 401, text: "Unauthorized" },
	{ code: 403, text: "Forbidden" },
	{ code: 404, text: "Not Found" },
	{ code: 409, text: "Conflict" },
	{ code: 429, text: "Too Many Requests" },
	{ code: 500, text: "Internal Server Error" },
	{ code: 502, text: "Bad Gateway" },
	{ code: 503, text: "Service Unavailable" },
];

export function email(rng: Random, locale: Locale): string {
	const fn = slug(firstName(rng, locale));
	const ln = slug(lastName(rng, locale));
	const ds = locale.internet.emailDomains;
	return `${fn}.${ln}@${ds[rng.int(0, ds.length - 1)]}`;
}

export function companyEmail(
	rng: Random,
	locale: Locale,
	opts?: {
		domain?: string;
		pattern?: "first.last" | "flast" | "first" | "last";
		separator?: string;
	},
): string {
	const f = slug(firstName(rng, locale));
	const l = slug(lastName(rng, locale));
	const sep = opts?.separator ?? ".";
	const pattern = opts?.pattern ?? "first.last";
	const local =
		pattern === "first"
			? f
			: pattern === "last"
				? l
				: pattern === "flast"
					? `${f[0]}${l}`
					: `${f}${sep}${l}`;
	const domain =
		opts?.domain ??
		locale.internet.emailDomains[
			rng.int(0, locale.internet.emailDomains.length - 1)
		];
	return `${local}@${domain}`;
}

export function username(
	rng: Random,
	locale: Locale,
	opts?: { style?: "first.last" | "first_last" | "flast" | "first" },
): string {
	const f = slug(firstName(rng, locale)).replace(/\.+/g, "");
	const l = slug(lastName(rng, locale)).replace(/\.+/g, "");
	const style = opts?.style ?? "first.last";
	switch (style) {
		case "first_last":
			return `${f}_${l}`;
		case "flast":
			return `${f[0]}${l}`;
		case "first":
			return f;
		default:
			return `${f}.${l}`;
	}
}

export function domain(
	rng: Random,
	locale: Locale,
	opts?: { subdomain?: boolean },
): string {
	const base =
		locale.internet.emailDomains[
			rng.int(0, locale.internet.emailDomains.length - 1)
		];
	if (!opts?.subdomain) return base;
	const sd = WORDS[rng.int(0, WORDS.length - 1)];
	return `${sd}.${base}`;
}

export function url(
	rng: Random,
	locale: Locale,
	opts?: { https?: boolean; subdomain?: boolean; pathSegments?: number },
): string {
	const proto = opts?.https === false ? "http" : "https";
	const host = domain(rng, locale, { subdomain: opts?.subdomain ?? false });
	const depth = Math.max(0, Math.floor(opts?.pathSegments ?? 2));
	const path =
		depth === 0
			? ""
			: "/" +
				Array.from({ length: depth }, () => slug(firstName(rng, locale))).join(
					"/",
				);
	return `${proto}://${host}${path}`;
}

export function ipv4(rng: Random): string {
	const a = rng.int(1, 223); // avoid multicast/reserved high blocks
	const b = rng.int(0, 255);
	const c = rng.int(0, 255);
	const d = rng.int(1, 254); // avoid .0 and .255 broadcast
	return `${a}.${b}.${c}.${d}`;
}

export function ipv6(rng: Random): string {
	const group = () => rng.int(0, 0xffff).toString(16).padStart(4, "0");
	return Array.from({ length: 8 }, group).join(":");
}

export function mac(rng: Random): string {
	const octet = () => rng.int(0, 255).toString(16).padStart(2, "0");
	return `${octet()}:${octet()}:${octet()}:${octet()}:${octet()}:${octet()}`;
}

export function httpMethod(rng: Random): (typeof METHODS)[number] {
	return METHODS[rng.int(0, METHODS.length - 1)];
}

export function httpStatus(
	rng: Random,
	opts?: { group?: 2 | 3 | 4 | 5 },
): { code: number; text: string } {
	const group = opts?.group;
	const pool = group
		? STATUS.filter((s) => Math.floor(s.code / 100) === group)
		: STATUS;
	return pool[rng.int(0, pool.length - 1)];
}

// Deprecated: uuidV4 moved to ./ids. Kept export here for backward-compat via re-export in index.

export function password(
	rng: Random,
	opts?: {
		length?: number;
		upper?: boolean;
		lower?: boolean;
		digits?: boolean;
		symbols?: boolean;
	},
): string {
	const length = Math.max(4, Math.floor(opts?.length ?? 12));
	const upper = opts?.upper ?? true;
	const lower = opts?.lower ?? true;
	const digits = opts?.digits ?? true;
	const symbols = opts?.symbols ?? false;
	const U = upper ? "ABCDEFGHIJKLMNOPQRSTUVWXYZ" : "";
	const L = lower ? "abcdefghijklmnopqrstuvwxyz" : "";
	const D = digits ? "0123456789" : "";
	const S = symbols ? "!@#$%^&*()-_=+[]{};:,.?/" : "";
	const pool = U + L + D + S || "abcdefghijklmnopqrstuvwxyz";
	let out = "";
	for (let i = 0; i < length; i++) out += pool[rng.int(0, pool.length - 1)];
	return out;
}

export function port(
	rng: Random,
	opts?: { min?: number; max?: number },
): number {
	const min = Math.max(1, Math.floor(opts?.min ?? 1024));
	const max = Math.max(min, Math.floor(opts?.max ?? 65535));
	return rng.int(min, max);
}

export function safeEmail(
	rng: Random,
	opts?: { domain?: "example.com" | "example.org" | "example.net" },
): string {
	const domain =
		opts?.domain ??
		(rng.int(0, 2) === 0
			? "example.com"
			: rng.int(0, 1) === 0
				? "example.org"
				: "example.net");
	const local = `user${rng.int(1, 9999)}`;
	return `${local}@${domain}`;
}
