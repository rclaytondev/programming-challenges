import { ArrayUtils } from "../../utils-ts/modules/core-extensions/ArrayUtils.mjs";
import { SetUtils } from "../../utils-ts/modules/core-extensions/SetUtils.mjs";
import { GenUtils } from "../../utils-ts/modules/core-extensions/GenUtils.mjs";

const OPERATIONS = [
	(a: number, b: number) => a + b,
	(a: number, b: number) => a - b,
	(a: number, b: number) => a * b,
	(a: number, b: number) => a / b,
];

const arithmeticCombinations = (nums: number[]) => {
	if(nums.length === 1) {
		return new Set(nums);
	}

	const results = new Set<number>();
	for(const subset of GenUtils.subsets(nums)) {
		if(subset.size === 0 || subset.size === nums.length) { continue; }
		const others = nums.filter(n => !subset.has(n));
		const combinations1 = arithmeticCombinations([...subset]);
		const combinations2 = arithmeticCombinations(others);
		for(const combination1 of combinations1) {
			for(const combination2 of combinations2) {
				for(const operation of OPERATIONS) {
					results.add(operation(combination1, combination2));
				}
			}
		}
	}
	return results;
};

const MAX_DIGIT = 9;
const NUM_DIGITS = 4;

const streakLength = (nums: Set<number>) => {
	for(let n = 1; true; n ++) {
		if(!nums.has(n)) {
			return n - 1;
		}
	}
};

const solve = () => {
	return ArrayUtils.maxEntry(
		[...GenUtils.subsets(ArrayUtils.range(1, MAX_DIGIT), NUM_DIGITS)],
		s => streakLength(arithmeticCombinations([...s]))
	);
};
// console.time();
// console.log(solve());
// console.timeEnd();
// debugger;
