import { HashSet } from "../../utils-ts/modules/HashSet.mjs";
import { Utils } from "../../utils-ts/modules/Utils.mjs";
import { isSpecial } from "./special-subset-sums-optimum-2.mjs";

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
	for(let first = 1; first * size + size * (size - 1) / 2 <= sum; first ++) {
		for(const set of specialSets(size - 1, sum - first)) {
			if(first < Math.min(...set) && isSpecial([first, ...set])) {
				sets.add([first, ...set]);
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
