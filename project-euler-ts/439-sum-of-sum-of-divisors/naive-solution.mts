import { MathUtils } from "../../utils-ts/modules/math/MathUtils.mjs";

export const naiveDivisorSumSum = (upperBound: number) => {
	/* Runs in O(n^3) time */
	let sum = 0;
	for(let i = 1; i <= upperBound; i ++) {
		for(let j = 1; j <= upperBound; j ++) {
			sum += MathUtils.sum(MathUtils.divisors(i * j));
		}
	}
	return sum;
};

// console.time();
// console.log(naiveDivisorSumSum(1000));
// console.timeEnd();
// debugger;
