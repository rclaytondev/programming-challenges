import { HashSet } from "../../utils-ts/modules/HashSet.mjs";
import { MathUtils } from "../../utils-ts/modules/math/MathUtils.mjs";
import { Utils } from "../../utils-ts/modules/Utils.mjs";

export const subsetHasSum = Utils.memoize((set: number[], sum: number): boolean => {
	if(set.length === 1) {
		return sum === 0 || set[0] === sum;
	}
	const [first, ...others] = set;
	return subsetHasSum(others, sum) || subsetHasSum(others, sum - first);
});

export const isSpecial = Utils.memoize((set: number[]) => {
	for(let length = 1; length < set.length - 1; length ++) {
		const initialSum = MathUtils.sum(set.slice(0, length + 1));
		const finalSum = MathUtils.sum(set.slice(-length));
		if(initialSum <= finalSum) {
			return false;
		}
	}
	for(let size = 1; size * 2 <= set.length; size ++) {
		for(const subset of Utils.subsets(set, size)) {
			if(subsetHasSum(set.filter(v => !subset.has(v)), MathUtils.sum(subset))) {
				return false;
			}
		}
	}
	return true;
}, (set) => [set.sort((a, b) => a - b)] as [number[]]);

const specialSets = Utils.memoize((size: number, sum: number): HashSet<number[]> => {
	if(size === 1) {
		return sum > 0 ? new HashSet([[sum]]) : new HashSet();
	}
	if(size === 2) {
		const sets = new HashSet<number[]>();
		for(let i = 1; i < sum; i ++) {
			if(i < sum - i) {
				sets.add([i, sum - i]);
			}
		}
		return sets;
	}

	const sets = new HashSet<number[]>();
	const leftSize = Math.floor(size / 2);
	const rightSize = Math.ceil(size / 2);
	for(let leftSum = leftSize * (leftSize + 1) / 2; leftSum <= sum - (rightSize * (rightSize + 1) / 2); leftSum ++) {
		const rightSum = sum - leftSum;
		const leftSets = specialSets(leftSize, leftSum);
		const rightSets = specialSets(rightSize, rightSum);
		for(const leftSet of leftSets) {
			const max = Math.max(...leftSet);
			for(const rightSet of [...rightSets].filter(s => Math.min(...s) > max)) {
				if(isSpecial([...leftSet, ...rightSet])) {
					sets.add([...leftSet, ...rightSet].sort((a, b) => a - b));
				}
			}
		}
	}
	return sets;
});

export const optimalSpecialSet = (setSize: number) => {
	for(let sum = setSize * (setSize - 1) / 2; true; sum ++) {
		console.log(sum);
		for(const set of specialSets(setSize, sum)) {
			return set;
		}
	}
};


console.time();
console.log(optimalSpecialSet(7));
console.timeEnd();
debugger;
