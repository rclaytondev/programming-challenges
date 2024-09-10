import { MathUtils } from "../../utils-ts/modules/math/MathUtils.mjs";

export const idempotentSum = (upperBound: number) => {
	let largestIdempotents = new Map<number, number>();
	for(let a = 2; a < upperBound; a ++) {
		for(const modulo of MathUtils.divisors(a ** 2 - a)) {
			if(a < modulo) {
				largestIdempotents.set(
					modulo,
					Math.max(largestIdempotents.get(modulo) ?? 1, a)
				);
			}
		}
	}
	let sum = 0;
	for(let modulo = 1; modulo <= upperBound; modulo ++) {
		sum += largestIdempotents.get(modulo) ?? 1;
	}
	return sum;
};

// console.time();
// console.log(idempotentSum(40_000));
// console.timeEnd();
// debugger;
