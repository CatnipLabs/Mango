import type { Random } from "../core/random";
import type { Locale } from "../types";

function numerify(rng: Random, pattern: string): string {
	return pattern.replace(/#/g, () => String(rng.int(0, 9)));
}

export function phone(rng: Random, locale: Locale): string {
	const formats = locale.phone.formats;
	const fmt = formats[rng.int(0, formats.length - 1)];
	return numerify(rng, fmt);
}
