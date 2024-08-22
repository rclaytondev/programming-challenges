import { MathUtils } from "../../utils-ts/modules/math/MathUtils.mjs";
import { Utils } from "../../utils-ts/modules/Utils.mjs";

type NumSet = { size: number, sum: number, product: number, next: number };
const EMPTY_SET: NumSet = { size: 0, sum: 0, product: 1, next: 1 };

const getNewSet = (set: NumSet): NumSet => ({
	size: set.size + 1,
	sum: set.sum + set.next,
	product: set.product * set.next,
	next: set.next
});

export const solve = (maxSetSize: number) => {
	const sets = [EMPTY_SET];
	const minimalNumbers = new Map<number, number>();
	let upperBound = Infinity;
	while(true) {
		const nextSet = Utils.minValue(sets, s => Math.max(s.sum + s.next, s.product * s.next));
		const newSet = getNewSet(nextSet);
		nextSet.next ++;
		sets.push(newSet);
		if(newSet.size > 1 && newSet.size <= maxSetSize && newSet.sum === newSet.product && newSet.sum < (minimalNumbers.get(newSet.size) ?? Infinity)) {
			/* found a product-sum number! */
			minimalNumbers.set(newSet.size, newSet.sum);
			upperBound = minimalNumbers.size === maxSetSize - 1 ? Math.min(...minimalNumbers.values()) : Infinity;
		}
		if(Math.max(newSet.sum, newSet.product) > upperBound) {
			break;
		}
	}
	return MathUtils.sum([...new Set(minimalNumbers.values())]);
};
