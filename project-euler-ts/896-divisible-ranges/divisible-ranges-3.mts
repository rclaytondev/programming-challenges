import { MathUtils } from "../../utils-ts/modules/math/MathUtils.mjs";
import { Sequence } from "../../utils-ts/modules/math/Sequence.mjs";
import { Utils } from "../../utils-ts/modules/Utils.mjs";
import { isDivisible } from "./divisible-ranges.mjs";

class PeriodicSequence {
	readonly period: number;
	readonly offsets: number[]; // intended to be between 1 and `period`, inclusive.
	readonly sequenceObj: Sequence;

	constructor(period: number, offsets: number[]) {
		this.period = period;
		this.offsets = offsets;
		this.sequenceObj = new Sequence(n => this.period * Math.floor(n / this.offsets.length) + this.offsets[n % this.offsets.length]);
	}

	static fromIncludes(period: number, includes: (num: number) => boolean) {
		return new PeriodicSequence(period, Utils.range(1, period).filter(includes));
	}

	includes(num: number) {
		return this.offsets.includes(num % this.period);
	}


	density() {
		return this.offsets.length / this.period;
	}
	intersection(sequence: PeriodicSequence): PeriodicSequence {
		if(this.density() > sequence.density()) {
			return sequence.intersection(this);
		}
		const newPeriod = MathUtils.lcm(this.period, sequence.period);
		const offsets = [];
		for(const term of this.sequenceObj.termsBelow(newPeriod)) {
			if(sequence.includes(term)) {
				offsets.push(term);
			}
		}
		return new PeriodicSequence(newPeriod, offsets);
	}
	multiply(multiplier: number) {
		return new PeriodicSequence(this.period * multiplier, this.offsets.map(o => o * multiplier));
	}
	filter(callback: (num: number) => boolean) {
		return new PeriodicSequence(this.period, this.offsets.filter(callback));
	}
}

const divisibleRanges = (size: number): PeriodicSequence => {
	const factors = MathUtils.factors(size);
	if(MathUtils.isPrime(size)) {
		const period = Utils.range(1, size).reduce(MathUtils.lcm);
		return PeriodicSequence.fromIncludes(period, r => isDivisible(size, r));
	}
	else if(factors.length === 1) {
		const [factor] = factors;
		const ranges = divisibleRanges(size / factor);
		return ranges.multiply(factor).filter(r => isDivisible(size, r));
	}
	else {
		const [factor1, factor2] = factors;
		const ranges1 = divisibleRanges(size / factor1);
		const ranges2 = divisibleRanges(size / factor2);
		return ranges1.multiply(factor1).intersection(ranges2.multiply(factor2)).filter(r => isDivisible(size, r));
	}
};

const solve = (size: number) => {
	return divisibleRanges(size).sequenceObj.getTerm(size - 1);
};
console.log(solve(10));
debugger;
