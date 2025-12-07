import { MathUtils } from "../../utils-ts/modules/math/MathUtils.mjs";
import { Sequence } from "../../utils-ts/modules/math/Sequence.mjs";
import { Utils } from "../../utils-ts/modules/Utils.mjs";
import { PeriodicSet } from "../project-specific-utilities/PeriodicSet.mjs";
import { isDivisible } from "./divisible-ranges.mjs";

const streakify = (pset: PeriodicSet, streakLength: number) => {
	const newOffsets = new Set<number>();
	for(const offset of pset.offsets) {
		for(let num = offset; num > offset - streakLength; num --) {
			if(!newOffsets.has(num % pset.period)) {
				newOffsets.add(num % pset.period);
			}
		}
	}
	return new PeriodicSet(pset.period, [...newOffsets].sort((a, b) => a - b));
};

export const divisibleRanges = (size: number): PeriodicSet => {
	if(size === 1) {
		return new PeriodicSet(1, [0]);
	}

	const factors = MathUtils.factors(size);
	const period = Utils.range(1, size).reduce(MathUtils.lcm);
	if(factors.length === 1) {
		return PeriodicSet.fromIncludes(period, r => isDivisible(size, r));
	}
	else {
		let [factor1, factor2] = factors;
		let candidates1 = streakify(divisibleRanges(size / factor1).multiply(factor1), factor1);
		let candidates2 = streakify(divisibleRanges(size / factor2).multiply(factor2), factor2);
		const candidates = candidates1.intersection(candidates2);
		const offsets = [...candidates.termsBelow(period)].filter(r => isDivisible(size, r));
		return new PeriodicSet(period, offsets);
	}
};

export const solve = (size: number) => {
	const factors = MathUtils.factors(size);
	const period = Utils.range(1, size).reduce(MathUtils.lcm);
	if(factors.length === 1) {
		return PeriodicSet.fromIncludes(period, r => isDivisible(size, r)).getTerm(size - 1);
	}
	let [factor1, factor2] = factors;
	let candidates1 = streakify(divisibleRanges(size / factor1).multiply(factor1), factor1);
	let candidates2 = streakify(divisibleRanges(size / factor2).multiply(factor2), factor2);
	let numFound = 0;
	for(const candidate of candidates1.values()) {
		if(candidates2.includes(candidate) && isDivisible(size, candidate)) {
			numFound ++;
			if(numFound === size) {
				return candidate;
			}
		}
	}
	throw new Error("Unreachable.");
};
