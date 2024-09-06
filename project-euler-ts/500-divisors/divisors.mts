import { MathUtils } from "../../utils-ts/modules/math/MathUtils.mjs";
import { Sequence } from "../../utils-ts/modules/math/Sequence.mjs";
import { Utils } from "../../utils-ts/modules/Utils.mjs";
import { GroupedArray } from "./GroupedArray.mjs";

export const naiveSolution = (log2OfDivisors: number) => {
	const divisors = 2 ** log2OfDivisors;
	for(let i = 0; true; i ++) {
		if(MathUtils.divisors(i).length === divisors) {
			return i;
		}
	}
};

export const leastWithDivisors = (log2OfDivisors: number) => {
	const exponents = GroupedArray.fromArray([0]);
	for(let i = 0; i < log2OfDivisors; i ++) {
		const getMultiplier = ([index, exponent]: [number, number]) => Sequence.PRIMES.getTerm(index) ** (exponent + 1);
		const [nextIndex] = Utils.minValue([...exponents.groupStartEntries()], getMultiplier);
		exponents.update(nextIndex, v => 2 * v + 1);
		if(exponents.last() !== 0) {
			exponents.push(0);
		}
	}
	return MathUtils.product([...exponents.entries()].map(([index, exp]) => Sequence.PRIMES.getTerm(index) ** exp));
};

console.time();
console.log(leastWithDivisors(500500));
console.timeEnd();
debugger;
