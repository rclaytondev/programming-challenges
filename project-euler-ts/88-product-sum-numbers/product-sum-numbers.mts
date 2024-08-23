import { MathUtils } from "../../utils-ts/modules/math/MathUtils.mjs";
import { Tree } from "../../utils-ts/modules/math/Tree.mjs";
import { CountLogger } from "../project-specific-utilities/CountLogger.mjs";

type NumSet = { size: number, sum: number, product: number, max: number };

const addToSet = (set: NumSet, num: number): NumSet => ({
	size: set.size + 1,
	sum: set.sum + num,
	product: set.product * num,
	max: Math.max(set.max, num)
});

export const minimalProductSumNumber = (setSize: number) => {
	let smallest = 2 * setSize;
	const EMPTY_SET = { size: 0, sum: 0, product: 1, max: 0 };
	const searchSets = (set: NumSet) => {
		if(set.product >= 2 && set.size + (set.product - set.sum) > setSize) {
			return;
		}
		if(set.size + (set.product - set.sum) === setSize) {
			smallest = Math.min(smallest, set.product);
		}
		if(set.size >= setSize) { return; }
		for(let next = Math.max(set.max, 2); set.sum + next < smallest && set.product * next < smallest; next ++) {
			searchSets(addToSet(set, next));
		}
	};
	searchSets(EMPTY_SET);
	return smallest;
};


export const solve = (upperBound: number) => {
	const logger = new CountLogger(n => 100 * n, upperBound);
	let numbers = new Set<number>();
	for(let setSize = 2; setSize <= upperBound; setSize ++) {
		logger.countTo(setSize);
		numbers.add(minimalProductSumNumber(setSize));
	}
	return MathUtils.sum([...numbers]);
};

console.time();
console.log(solve(12000));
console.timeEnd();
debugger;
