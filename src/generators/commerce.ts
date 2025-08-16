import type { Random } from "../core/random";
import type { Locale } from "../types";

function pick<T>(rng: Random, arr: readonly T[]): T {
	return arr[rng.int(0, arr.length - 1)];
}

function replacePattern(rng: Random, pattern: string): string {
	// A => uppercase letter A-Z, # => digit 0-9, X => uppercase alphanumeric
	const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	const alnum = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	let out = "";
	for (const ch of pattern) {
		if (ch === "A") out += letters[rng.int(0, letters.length - 1)];
		else if (ch === "#") out += String(rng.int(0, 9));
		else if (ch === "X") out += alnum[rng.int(0, alnum.length - 1)];
		else out += ch;
	}
	return out;
}

export function category(rng: Random, locale: Locale): string {
	return pick(rng, locale.commerce.categories);
}

export function productName(rng: Random, locale: Locale): string {
	return pick(rng, locale.commerce.productNames);
}

export function price(
	rng: Random,
	locale: Locale,
	opts?: { min?: number; max?: number; decimals?: number },
): number {
	const min = Math.max(0, opts?.min ?? locale.commerce.priceMin ?? 1);
	const max = Math.max(min, opts?.max ?? locale.commerce.priceMax ?? 1000);
	const decimals = Math.max(0, Math.min(4, opts?.decimals ?? 2));
	const centsMin = Math.round(min * 10 ** decimals);
	const centsMax = Math.round(max * 10 ** decimals);
	const val = rng.int(centsMin, centsMax) / 10 ** decimals;
	return Number(val.toFixed(decimals));
}

export function priceWithCurrency(
	rng: Random,
	locale: Locale,
	opts?: { min?: number; max?: number; decimals?: number },
): { amount: number; currency?: string } {
	const amount = price(rng, locale, opts);
	const c = locale.commerce.currency;
	return c ? { amount, currency: c } : { amount };
}

export function quantity(
	rng: Random,
	opts?: { min?: number; max?: number },
): number {
	const min = Math.max(1, Math.floor(opts?.min ?? 1));
	const max = Math.max(min, Math.floor(opts?.max ?? 100));
	return rng.int(min, max);
}

export function sku(rng: Random, opts?: { pattern?: string }): string {
	const pattern = opts?.pattern ?? "AAA-####-###";
	return replacePattern(rng, pattern);
}

function upcCheckDigit(digits11: number[]): number {
	// UPC-A: positions 1..11 from left; sum odd*3 + even*1
	let sumOdd = 0,
		sumEven = 0;
	for (let i = 0; i < 11; i++) {
		const d = digits11[i];
		if ((i + 1) % 2 === 1) sumOdd += d;
		else sumEven += d;
	}
	const mod = (sumOdd * 3 + sumEven) % 10;
	return (10 - mod) % 10;
}

export function upc(rng: Random): string {
	const digits = Array.from({ length: 11 }, () => rng.int(0, 9));
	const cd = upcCheckDigit(digits);
	return digits.join("") + String(cd);
}

function ean13CheckDigit(digits12: number[]): number {
	// EAN-13: sum of odd positions + 3*sum of even positions (positions 1..12 from left)
	let sumOdd = 0,
		sumEven = 0;
	for (let i = 0; i < 12; i++) {
		const d = digits12[i];
		if ((i + 1) % 2 === 1) sumOdd += d;
		else sumEven += d;
	}
	const mod = (sumOdd + sumEven * 3) % 10;
	return (10 - mod) % 10;
}

export function ean13(rng: Random): string {
	const digits = Array.from({ length: 12 }, () => rng.int(0, 9));
	const cd = ean13CheckDigit(digits);
	return digits.join("") + String(cd);
}

export function purchaseOrderNumber(
	rng: Random,
	opts?: { prefix?: string },
): string {
	const prefix = opts?.prefix ?? "PO";
	// Format: PREFIX-XXXXXX-XXXX (alphanumeric)
	const part1 = replacePattern(rng, "XXXXXX");
	const part2 = replacePattern(rng, "XXXX");
	return `${prefix}-${part1}-${part2}`;
}

export function invoiceNumber(rng: Random, opts?: { prefix?: string }): string {
	const prefix = opts?.prefix ?? "INV";
	const body = replacePattern(rng, "#########");
	return `${prefix}-${body}`;
}

export function transactionId(rng: Random, length = 16): string {
	const hex = "0123456789abcdef";
	let out = "";
	for (let i = 0; i < Math.max(1, length); i++) out += hex[rng.int(0, 15)];
	return out;
}

export function currencyCode(locale: Locale): string | undefined {
	return locale.commerce.currency;
}
