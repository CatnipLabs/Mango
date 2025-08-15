import type { Random } from "../core/random";

export function multiple<T>(count: number, fn: (index: number) => T): T[] {
	const n = Math.max(0, Math.floor(count));
	const out: T[] = new Array(n);
	for (let i = 0; i < n; i++) out[i] = fn(i);
	return out;
}

export function generateMany<T>(
	rng: Random,
	count: number,
	fn: (rng: Random, index: number) => T,
): T[] {
	// Note: rng is shared to keep deterministic sequence
	return multiple(count, (i) => fn(rng, i));
}
