import type { Random } from "../core/random";
import type { Locale } from "../types";

function pick<T>(rng: Random, arr: readonly T[]): T {
	return arr[rng.int(0, arr.length - 1)];
}

function numerify(rng: Random, pattern: string): string {
	// Replace each # with a random digit 0-9
	return pattern.replace(/#/g, () => String(rng.int(0, 9)));
}

export function street(rng: Random, locale: Locale): string {
	const preFiltered = locale.address.streetPrefixes?.filter(Boolean) ?? [""];
	const pre = preFiltered.length > 0 ? preFiltered : [""];
	const name = pick(rng, locale.address.streetNames);
	const sufFiltered = locale.address.streetSuffixes?.filter(Boolean) ?? [""];
	const suf = sufFiltered.length > 0 ? sufFiltered : [""];
	const parts = [pick(rng, pre), name, pick(rng, suf)].filter(Boolean);
	return parts.join(" ").replace(/\s+/g, " ").trim();
}

export function streetNumber(rng: Random, locale: Locale): number {
	const min = locale.address.numberMin ?? 1;
	const max = locale.address.numberMax ?? 9999;
	return rng.int(min, max);
}

export function city(rng: Random, locale: Locale): string {
	return pick(rng, locale.address.cities);
}

export function state(
	rng: Random,
	locale: Locale,
): { code: string; name: string } {
	return pick(rng, locale.address.states);
}

export function zip(rng: Random, locale: Locale): string {
	return numerify(rng, locale.address.zipFormat);
}

export function fullAddress(rng: Random, locale: Locale): string {
	const s = street(rng, locale);
	const n = streetNumber(rng, locale);
	const c = city(rng, locale);
	const st = state(rng, locale);
	const z = zip(rng, locale);
	// Format: "123 Maple St, Springfield, CA 90210"
	return `${n} ${s}, ${c}, ${st.code} ${z}`;
}
