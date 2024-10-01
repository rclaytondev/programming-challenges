import { isSpecial } from "./special-subset-sums-optimum-2.mjs";

const setsCache = new Map<string, number[][]>();
const specialSets = (size: number, sum: number): number[][] => {
	if(size === 1) {
		return sum > 0 ? [[sum]] : [];
	}
	if(size === 2) {
		const sets = [];
		for(let i = 1; i < sum; i ++) {
			if(i < sum - i) {
				sets.push([i, sum - i]);
			}
		}
		return sets;
	}
	const argsString = `${size},${sum}`;
	if(setsCache.has(argsString)) {
		return setsCache.get(argsString)!;
	}

	const sets = [];
	for(let first = 1; first * size + size * (size - 1) / 2 <= sum; first ++) {
		for(const set of specialSets(size - 1, sum - first)) {
			if(first < Math.min(...set) && isSpecial([first, ...set])) {
				sets.push([first, ...set]);
			}
		}
	}
	setsCache.set(argsString, sets);
	return sets;
};

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
