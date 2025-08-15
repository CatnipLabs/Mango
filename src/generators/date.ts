import type { Random } from "../core/random";

/**
 * Return a Date between start and end (inclusive by day). Defaults: last year to now.
 */
export function between(rng: Random, start?: Date, end?: Date): Date {
	const s = (start ?? new Date(Date.now() - 365 * 24 * 3600 * 1000)).getTime();
	const e = (end ?? new Date()).getTime();
	if (e < s) throw new RangeError("end < start");
	const ts = rng.int(s, e);
	return new Date(ts);
}

export function recent(rng: Random, days = 30): Date {
	const now = Date.now();
	const start = now - Math.max(0, days) * 24 * 3600 * 1000;
	const ts = rng.int(start, now);
	return new Date(ts);
}

export function soon(rng: Random, days = 30): Date {
	const now = Date.now();
	const end = now + Math.max(0, days) * 24 * 3600 * 1000;
	const ts = rng.int(now, end);
	return new Date(ts);
}
