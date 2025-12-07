import { MathUtils } from "../../utils-ts/modules/math/MathUtils.mjs";
import { Utils } from "../../utils-ts/modules/Utils.mjs";

// export const idempotents = (entryUpperBound: number) => {
// 	return rank1Idempotents(entryUpperBound) + rank2Idempotents(entryUpperBound) + 2;
// };

export class Range {	
	readonly data: "empty" | { readonly min: number, readonly max: number };

	static readonly EMPTY = new Range("empty");
	static readonly ALL = new Range({ min: -Infinity, max: Infinity });

	constructor(data: "empty" | { readonly min: number, readonly max: number }) {
		if(data === "empty" || data.min > data.max) {
			this.data = "empty";
		}
		else {
			this.data = data;
		}
	}

	includes(value: number, startMode: "open" | "closed" = "closed", endMode: "open" | "closed" = "closed") {
		if(this.data === "empty") { return false; }
		return (
			(value > this.data.min || (value === this.data.min && startMode === "closed")) &&
			(value < this.data.max || (value === this.data.max && endMode === "closed"))
		);
	}

	toString() {
		return (this.data === "empty") ? "[empty range]" : `[${this.data.min} .. ${this.data.max}]`;
	}

	shrinkToInt() {
		if(this.data === "empty") { return this; }
		return new Range({ min: Math.ceil(this.data.min), max: Math.floor(this.data.max) });
	}
	numIntegers() {
		const shrunk = this.shrinkToInt();
		if(shrunk.data === "empty") { return 0; }
		return shrunk.data.max - shrunk.data.min + 1;
	}

	static intersection(...ranges: Range[]) {
		const min = Math.max(...ranges.map(r => r.data === "empty" ? Infinity : r.data.min));
		const max = Math.min(...ranges.map(r => r.data === "empty" ? -Infinity : r.data.max));
		return new Range({ min, max });
	}
}

const linearPreimage = (slope: number, yIntercept: number, range: Range) => {
	if(slope === 0) {
		return range.includes(yIntercept) ? Range.ALL : Range.EMPTY;
	}
	if(range.data === "empty") { return Range.EMPTY; }

	if(slope > 0) {
		return new Range({
			min: (range.data.min - yIntercept) / slope,
			max: (range.data.max - yIntercept) / slope
		});
	}
	else {
		return new Range({
			min: (range.data.max - yIntercept) / slope,
			max: (range.data.min - yIntercept) / slope
		})
	}
};

export const rank1Idempotents = (entryUpperBound: number) => {
	const ENTRY_RANGE = new Range({ min: -entryUpperBound, max: entryUpperBound });
	
	let result = 0;
	for(const [a0, a1, a2] of Utils.cartesianPower(Utils.range(-entryUpperBound, entryUpperBound), 3)) {
		// if(a1 === 0 && a2 === 0) {
		// 	result += ENTRY_RANGE.numIntegers() ** 2;
		// }
		// else if(a1 === 0) {
		// 	result += linearPreimage()
		// }

		const rowMax = Math.max(Math.abs(a0), Math.abs(a1), Math.abs(a2));
		const columnUpperBound = Math.floor(entryUpperBound / rowMax);
		const gcd = MathUtils.gcd(a1, a2);
		const k1 = a1 / gcd;
		const k2 = a2 / gcd;
		for(const b0 of Utils.range(-columnUpperBound, columnUpperBound)) {
			const total = (1 - (a0 * b0)) / gcd;
			if(total !== Math.floor(total)) { continue; } // can optimize to skip this check
			const [s1, s2] = MathUtils.bezoutCoefficients(k1, k2).map(v => v * total);
			/*
			By construction, s1 k1 + s2 k2 = total, so gcd * (s1 a1 + s2 a2) = 1 - a0 b0.
			Therefore a0 b0 + (gcd s1 a1) + (gcd s2 a2) = 1.
			The solution has b1 = gcd s1 and b2 = gcd s2.
			Other solutions are the same except with s1 replaced by s1 - L k2 and s2 replaced by s2 + L k1 for some L.
			The next lines establish upper and lower bounds on L.
			*/
			const range = Range.intersection(
				...[a0, a1, a2].map(a => linearPreimage(-a * a0, a * gcd * s1, ENTRY_RANGE)),
				...[a0, a1, a2].map(a => linearPreimage(a * a1, a * gcd * s2, ENTRY_RANGE))
			);
			result += range.numIntegers();
		}
	}
	return result;
};
// const rank2Idempotents = (entryUpperBound: number) => {
// 	let result = 0;
// 	for(const [a0, a1, a2] of Utils.cartesianPower(Utils.range()))
// 	return result;
// };
