import { MathUtils } from "../../utils-ts/modules/math/MathUtils.mjs";
import { Tree } from "../../utils-ts/modules/math/Tree.mjs";
import { CountLogger } from "../project-specific-utilities/CountLogger.mjs";

export const isProductSumNumber = (num: number, setSize: number) => {
	const emptyList = { size: 0, sum: 0, product: 1, max: 0 };
	for(const result of Tree.leaves(emptyList, function*(list) {
		if(list.size < setSize) {
			for(let next = list.max; list.sum + next <= num && list.product * next <= num; next ++) {
				yield {
					size: list.size + 1,
					sum: list.sum + next,
					product: list.product * next,
					max: next
				};
			}
		}
	})) {
		if(result.size === setSize && result.sum === num && result.product === num) {
			return true;
		}
	}
	return false;
};

const minimalProductSumNumber = (setSize: number) => {
	for(let n = 1; n < Infinity; n ++) {
		if(isProductSumNumber(n, setSize)) {
			return n;
		}
	}
	throw new Error("Unreachable");
};


const solve = (upperBound: number) => {
	// const logger = new CountLogger(n => n, upperBound);
	let numbers = new Set<number>();
	for(let setSize = 2; setSize <= upperBound; setSize ++) {
		// logger.countTo(setSize);
		numbers.add(minimalProductSumNumber(setSize));
	}
	return MathUtils.sum([...numbers]);
};

// console.log(solve(12000));
// debugger;
