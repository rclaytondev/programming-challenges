import { Utils } from "../../utils-ts/modules/Utils.mjs";
import { isSpecialPair } from "./special-subset-sums-optimum.mjs";

const isSpecial = (set: number[]) => {
	for(const subset1 of Utils.subsets(set)) {
		if(subset1.size === 0) { continue; }
		for(const subset2 of Utils.subsets(set.filter(s => !subset1.has(s)))) {
			if(subset2.size === 0) { continue; }
			if(!isSpecialPair(subset1, subset2)) {
				return false;
			}
		}
	}
	return true;
};

const specialSets = Utils.memoize((size: number, sum: number): number[][] => {
	if(size === 1) {
		return sum > 0 ? [[sum]] : [];
	}
	if(size === 2) {
		const sets = [];
		for(let i = 1; i < sum; i ++) {
			if(i !== sum - i) {
				sets.push([i, sum - i]);
			}
		}
		return sets;
	}

	const sets = [];
	const leftSize = Math.floor(size / 2);
	const rightSize = Math.ceil(size / 2);
	for(let leftSum = 1; leftSum < sum; leftSum ++) {
		const rightSum = sum - leftSum;
		for(const leftSet of specialSets(leftSize, leftSum)) {
			for(const rightSet of specialSets(rightSize, rightSum)) {
				if(Utils.areDisjoint(leftSet, rightSet) && isSpecial([...leftSet, ...rightSet])) {
					sets.push([...leftSet, ...rightSet]);
				}
			}
		}
	}
	return sets;
});

export const optimalSpecialSet = (setSize: number) => {
	for(let sum = setSize * (setSize - 1) / 2; true; sum ++) {
		for(const set of specialSets(setSize, sum)) {
			return set;
		}
	}
};


console.time();
console.log(optimalSpecialSet(7));
console.timeEnd();
debugger;
