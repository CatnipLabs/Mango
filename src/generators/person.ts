import type { Random } from "../core/random";
import type { Locale } from "../types";

export function firstName(rng: Random, locale: Locale): string {
	const arr = locale.person.firstNames;
	return arr[rng.int(0, arr.length - 1)];
}
export function lastName(rng: Random, locale: Locale): string {
	const arr = locale.person.lastNames;
	return arr[rng.int(0, arr.length - 1)];
}
export function fullName(rng: Random, locale: Locale): string {
	return `${firstName(rng, locale)} ${lastName(rng, locale)}`;
}
