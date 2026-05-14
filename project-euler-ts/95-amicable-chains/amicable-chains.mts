import { MathUtils } from "../../utils-ts/modules/math/MathUtils.mjs";

const divisorSum = (num: number) => {
	return 1 + MathUtils.sum(MathUtils.properDivisors(num));
};

export const getAmicableLoop = (start: number, upperBound: number) => {
	const numsChecked = new Set<number>();
	let value = start;
	const loop = [];
	while(true) {
		loop.push(value);
		value = divisorSum(value);
		if(value > upperBound || numsChecked.has(value)) {
			return null;
		}
		if(value === start) {
			return loop;
		}
		numsChecked.add(value);
	}
};

export const solve = (upperBound: number) => {
	// const logger = new CountLogger(n => 1000 * n, upperBound);
	let longestLoop: number[] | null = null;
	for(let start = 1; start <= upperBound; start ++) {
		// logger.count();
		const loop = getAmicableLoop(start, upperBound);
		if(loop && loop.length > (longestLoop?.length ?? 0)) {
			longestLoop = loop;
		}
	}
	return longestLoop;
};
// console.log(solve(1000000));
// debugger;
