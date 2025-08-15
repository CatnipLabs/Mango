/**
 * Mulberry32-based PRNG (deterministic, non-cryptographic).
 *
 * Characteristics:
 * - Very fast and stable (32-bit operations)
 * - Period ~ 2^32 (Weyl sequence)
 * - Deterministic via seed
 * - DO NOT use for security/cryptography
 */
export class Random {
	private state: number;
	// Constants
	private static readonly UINT32_RANGE = 0x1_0000_0000; // 2^32
	private static readonly DEFAULT_SEED = 0xdeadbeef; // default seed
	private static readonly WEYL_INCREMENT = 0x6d2b79f5; // Weyl increment constant
	private static readonly MIX_SHIFT_1 = 15; // first right shift in mixing
	private static readonly MIX_SHIFT_2 = 7; // second right shift in mixing
	private static readonly MIX_SHIFT_3 = 14; // final right shift in mixing
	private static readonly ODD_MASK = 1; // ensures odd multiplier (value | 1)
	private static readonly MIX_CONSTANT = 61; // constant used in second mixing step
	private static readonly INCLUSIVE_RANGE_OFFSET = 1; // +1 for inclusive [min, max]

	constructor(seed = Random.DEFAULT_SEED) {
		this.state = seed >>> 0;
	}

	/** Set a new seed (unsigned 32-bit). */
	seed(seed: number) {
		this.state = seed >>> 0;
	}

	/**
	 * Generates an unsigned 32-bit integer using mulberry32, returning [0, 2^32).
	 * Steps:
	 * 1) Increment state by a Weyl sequence (ensures good cycle)
	 * 2) Mix bits using shifts, XORs, and multiplications (avalanche)
	 */
	private nextUint32(): number {
		// 1) Advance state with Weyl sequence
		this.state = (this.state + Random.WEYL_INCREMENT) >>> 0;
		// 2) Bit mixing (avalanche)
		let mixedValue = this.state;
		mixedValue = Math.imul(
			mixedValue ^ (mixedValue >>> Random.MIX_SHIFT_1),
			mixedValue | Random.ODD_MASK,
		);
		mixedValue ^=
			mixedValue +
			Math.imul(
				mixedValue ^ (mixedValue >>> Random.MIX_SHIFT_2),
				mixedValue | Random.MIX_CONSTANT,
			);
		const uint32 = (mixedValue ^ (mixedValue >>> Random.MIX_SHIFT_3)) >>> 0;
		return uint32;
	}

	/** Return a floating-point number in the range [0, 1). */
	next(): number {
		return this.nextUint32() / Random.UINT32_RANGE;
	}

	/**
	 * Inclusive integer in the range [min, max] without modulo bias (rejection sampling).
	 */
	int(min: number, max: number) {
		if (!Number.isFinite(min) || !Number.isFinite(max)) {
			throw new RangeError("min/max must be finite");
		}
		if (Math.floor(min) !== min || Math.floor(max) !== max) {
			throw new RangeError("min/max must be integers");
		}
		if (max < min) {
			throw new RangeError("max < min");
		}
		const range = (max - min + Random.INCLUSIVE_RANGE_OFFSET) >>> 0; // range size as uint32
		// Edge case: range === 0 implies range size 2^32 (32-bit overflow)
		if (range === 0) return min; // safe choice; avoids overflow when adding 2^32

		const limit = Random.UINT32_RANGE - (Random.UINT32_RANGE % range);
		let sample: number;
		do {
			sample = this.nextUint32();
		} while (sample >= limit); // reject samples that would introduce modulo bias

		return min + (sample % range);
	}
}
