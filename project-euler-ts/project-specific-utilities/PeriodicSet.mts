import { ArrayUtils } from "../../utils-ts/modules/core-extensions/ArrayUtils.mjs";
import { MathUtils } from "../../utils-ts/modules/math/MathUtils.mjs";
import { Utils } from "../../utils-ts/modules/Utils.mjs";

const modNonzero = (num: number, modulo: number) => {
	const result = MathUtils.generalizedModulo(num, modulo);
	return (result === 0) ? modulo : result;
};

export class PeriodicSet {
	readonly period: number;
	readonly offsets: readonly number[]; // intended to be between 1 and `period`, inclusive.
	constructor(period: number, offsets: number[]) {
		if(period <= 0 || period !== Math.floor(period)) {
			throw new Error(`Cannot construct PeriodicSet: expected a positive integer period, but got ${period}.`);
		}
		this.period = period;
		if(offsets.some(o => o !== Math.floor(o))) {
			throw new Error(`Cannot construct PeriodicSet: expected integer offsets, but instead got ${offsets}.`);
		}
		this.offsets = [...new Set(offsets.map(n => modNonzero(n, period)))].sort((a, b) => a - b);
	}

	static fromIncludes(period: number, includes: (num: number) => boolean) {
		return new PeriodicSet(period, ArrayUtils.range(1, period).filter(includes));
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
	numTermsBelow(upperBound: number) {
		if(upperBound <= 0) { return 0; }
		let count = this.offsets.length * Math.floor(upperBound / this.period);
		upperBound %= this.period;
		return count + this.offsets.filter(n => n <= upperBound).length; // can be optimized
	}
	getTerm(index: number) {
		return this.offsets[index % this.offsets.length] + this.period * Math.floor(index / this.offsets.length);
	}


	density() {
		return this.offsets.length / this.period;
	}
	intersection(sequence: PeriodicSet): PeriodicSet {
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
		return new PeriodicSet(newPeriod, offsets);
	}
	complement() {
		const offsets = new Set(this.offsets);
		return new PeriodicSet(
			this.period,
			ArrayUtils.range(1, this.period).filter(n => !offsets.has(n))
		);
	}
	multiply(multiplier: number) {
		return new PeriodicSet(this.period * multiplier, this.offsets.map(o => o * multiplier));
	}
	filter(callback: (num: number) => boolean) {
		return new PeriodicSet(this.period, this.offsets.filter(callback));
	}
}
