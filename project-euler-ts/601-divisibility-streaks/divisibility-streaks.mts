import { ArrayUtils } from "../../utils-ts/modules/core-extensions/ArrayUtils.mjs";
import { MathUtils } from "../../utils-ts/modules/math/MathUtils.mjs";
import { PeriodicSet } from "../project-specific-utilities/PeriodicSet.mjs";

export const numWithStreaks = (streakLength: number, maximum: number): number => {
	const divisibilityConditions = (ArrayUtils.range(1, streakLength).map(n => new PeriodicSet(n, [1])));
	const nonDivisibilityCondition = new PeriodicSet(streakLength + 1, [1]).complement();
	const streakCondition = [...divisibilityConditions, nonDivisibilityCondition].reduce((a, b) => a.intersection(b));
	return streakCondition.numTermsBelow(maximum - 1);
};

const solve = (upperBound: number) => {
	return MathUtils.sum(ArrayUtils.range(1, upperBound).map(n => numWithStreaks(n, 4 ** n)));
};

// console.time();
// console.log(solve(31));
// console.timeEnd();
// debugger;
