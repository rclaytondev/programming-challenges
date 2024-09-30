import { MathUtils } from "../../utils-ts/modules/math/MathUtils.mjs";
import { Utils } from "../../utils-ts/modules/Utils.mjs";

const implies = (a: boolean, b: boolean) => !a || b;

const isSpecialPair = (set1: number[], set2: number[]) => {
	const sum1 = MathUtils.sum(set1);
	const sum2 = MathUtils.sum(set2);
	return (
		sum1 !== sum2 &&
		implies(set1.length < set2.length, sum1 < sum2) &&
		implies(set1.length > set2.length, sum1 > sum2)
	);
};

const isNewSetSpecial = (specialSet: number[], newNumber: number) => {
	for(const subset1 of Utils.subsets(specialSet)) {
		if(subset1.size === 0) { continue; }
		for(const subset2 of Utils.subsets(specialSet.filter(v => !subset1.has(v)))) {
			if(subset2.size === 0) { continue; }
			if(!isSpecialPair([...subset1], [...subset2, newNumber])) {
				return false;
			}
		}
	}
	return true;
};

export const optimalSpecialSet = (setSize: number) => {
	let optimalSet: number[] = [];
	let optimalSum = Infinity;
	const search = (set: number[]) => {
		const sum = MathUtils.sum(set);
		if(set.length === setSize && sum < optimalSum) {
			optimalSet = set;
			optimalSum = sum;
		}
		else if(set.length < setSize) {
			const last = (set[set.length - 1]) ?? 0;
			const max = (set.length >= 2) ? set[0] + set[1] : Infinity;
			for(let next = last + 1; next < max && sum + next < optimalSum; next ++) {
				if(isNewSetSpecial(set, next)) {
					search([...set, next]);
				}
			}
		}
	};
	search([]);
	return optimalSet;
};
