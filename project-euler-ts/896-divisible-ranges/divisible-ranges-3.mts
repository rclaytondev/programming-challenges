import { MathUtils } from "../../utils-ts/modules/math/MathUtils.mjs";
import { Sequence } from "../../utils-ts/modules/math/Sequence.mjs";
import { Utils } from "../../utils-ts/modules/Utils.mjs";
import { isDivisible } from "./divisible-ranges.mjs";

const modNonzero = (num: number, modulo: number) => {
	const result = MathUtils.generalizedModulo(num, modulo);
	return (result === 0) ? modulo : result;
};

class PeriodicSequence {
	readonly period: number;
	readonly offsets: number[]; // intended to be between 1 and `period`, inclusive.

	constructor(period: number, offsets: number[]) {
		this.period = period;
		this.offsets = [...new Set(offsets.map(n => modNonzero(n, period)))].sort((a, b) => a - b);
	}

	static fromIncludes(period: number, includes: (num: number) => boolean) {
		return new PeriodicSequence(period, Utils.range(1, period).filter(includes));
	}

	includes(num: number) {
		return this.offsets.includes(modNonzero(num, this.period));
	}
	*values() {
		for(let multiplier = 0; multiplier < Infinity; multiplier ++) {
			for(const offset of this.offsets) {
				yield multiplier * this.period + offset;
			}
		}
	}
	termsBelow(upperBound: number) {
		const result = [];
		for(const value of this.values()) {
			if(value > upperBound) { break; }
			result.push(value);
		}
		return result;
	}
	getTerm(index: number) {
		return this.offsets[index % this.offsets.length] + this.period * Math.floor(index / this.offsets.length);
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
		for(const term of this.termsBelow(newPeriod)) {
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
	streakify(streakLength: number) {
		const newOffsets = new Set<number>();
		for(const offset of this.offsets) {
			for(let num = offset; num > offset - streakLength; num --) {
				if(!newOffsets.has(num % this.period)) {
					newOffsets.add(num % this.period);
				}
			}
		}
		return new PeriodicSequence(this.period, [...newOffsets].sort((a, b) => a - b));
	}
}

export const divisibleRanges = (size: number): PeriodicSequence => {
	const factors = MathUtils.factors(size);
	const period = Utils.range(1, size).reduce(MathUtils.lcm);
	if(factors.length === 1) {
		return PeriodicSequence.fromIncludes(period, r => isDivisible(size, r));
	}
	else {
		let [factor1, factor2] = factors;
		let candidates1 = divisibleRanges(size / factor1).multiply(factor1).streakify(factor1);
		let candidates2 = divisibleRanges(size / factor2).multiply(factor2).streakify(factor2);
		const candidates = candidates1.intersection(candidates2);
		const offsets = [...candidates.termsBelow(period)].filter(r => isDivisible(size, r));
		return new PeriodicSequence(period, offsets);
	}
};

export const solve = (size: number) => {
	return divisibleRanges(size).getTerm(size - 1);
};
