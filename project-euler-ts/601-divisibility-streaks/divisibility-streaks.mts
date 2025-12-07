import { MathUtils } from "../../utils-ts/modules/math/MathUtils.mjs";
import { Utils } from "../../utils-ts/modules/Utils.mjs";
import { PeriodicSet } from "../896-divisible-ranges/divisible-ranges-3.mjs";

export const numWithStreaks = (streakLength: number, maximum: number): number => {
	const divisibilityConditions = (Utils.range(1, streakLength).map(n => new PeriodicSet(n, [1])));
	const nonDivisibilityCondition = new PeriodicSet(streakLength + 1, [1]).complement();
	const streakCondition = [...divisibilityConditions, nonDivisibilityCondition].reduce((a, b) => a.intersection(b));
	return streakCondition.numTermsBelow(maximum - 1);
};

const solve = (upperBound: number) => {
	return MathUtils.sum(Utils.range(1, upperBound).map(n => numWithStreaks(n, 4 ** n)));
};

// console.time();
// console.log(solve(31));
// console.timeEnd();
// debugger;
