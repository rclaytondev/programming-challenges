import { MathUtils } from "../../utils-ts/modules/math/MathUtils.mjs";
import { PriorityQueue } from "../../utils-ts/modules/PriorityQueue.mjs";
import { Utils } from "../../utils-ts/modules/Utils.mjs";
import { CountLogger } from "../project-specific-utilities/CountLogger.mjs";

type NumSet = { size: number, sum: number, product: number, next: number };

const getNewSet = (set: NumSet): NumSet => ({
	size: set.size + 1,
	sum: set.sum + set.next,
	product: set.product * set.next,
	next: set.next
});

export const solve = (maxSetSize: number) => {
	const logger = new CountLogger(n => 100 * n, maxSetSize, "sets found");
	const logger2 = new CountLogger(n => 100 * n, null, "numbers checked");
	const EMPTY_SET: NumSet = { size: 0, sum: 0, product: 1, next: 1 };
	const sets = new PriorityQueue<NumSet>();
	sets.insert(EMPTY_SET, 1);
	const minimalNumbers = new Map<number, number>();
	while(minimalNumbers.size < maxSetSize - 1) {
		const nextSet = sets.pop();
		logger2.countTo(Math.max(nextSet.sum + nextSet.next, nextSet.product * nextSet.next));
		const newSet = getNewSet(nextSet);
		nextSet.next ++;
		if(newSet.size < maxSetSize) {
			sets.insert(newSet, Math.max(newSet.sum + newSet.next, newSet.product * newSet.next));
		}
		sets.insert(nextSet, Math.max(nextSet.sum + nextSet.next, nextSet.product * nextSet.next));
		if(newSet.size > 1 && newSet.size <= maxSetSize && newSet.sum === newSet.product && newSet.sum < (minimalNumbers.get(newSet.size) ?? Infinity)) {
			/* found a product-sum number! */
			minimalNumbers.set(newSet.size, newSet.sum);
			// logger.count();
		}
	}
	return MathUtils.sum([...new Set(minimalNumbers.values())]);
};

// console.time();
// console.log(solve(1000));
// console.timeEnd();
// debugger;
