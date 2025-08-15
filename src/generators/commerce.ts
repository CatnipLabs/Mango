import type { Random } from "../core/random";
import type { Locale } from "../types";

function pick<T>(rng: Random, arr: readonly T[]): T {
	return arr[rng.int(0, arr.length - 1)];
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
