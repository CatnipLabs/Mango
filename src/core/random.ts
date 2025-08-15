export class Random {
	private state: number;
	constructor(seed = 0xdeadbeef) {
		this.state = seed >>> 0;
	}
	seed(seed: number) {
		this.state = seed >>> 0;
	}
	next(): number {
		this.state += 0x6d2b79f5;
		let t = this.state;
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	}
	int(min: number, max: number) {
		return Math.floor(this.next() * (max - min + 1)) + min;
	}
}
