import { MathUtils } from "../../utils-ts/modules/math/MathUtils.mjs";
import { CountLogger } from "../project-specific-utilities/CountLogger.mjs";

const largestIdempotent = (modulo: number) => {
	if(MathUtils.isPrime(modulo)) {
		return 1;
	}
	for(let i = modulo - 1; i > 1; i --) {
		if((i ** 2) % modulo === i) {
			return i;
		}
	}
	return 1;
};

const solve = (upperBound: number) => {
	const logger = new CountLogger(n => 1000 * n, upperBound);
	let sum = 0;
	for(let m = 1; m <= upperBound; m ++) {
		logger.count();
		sum +=  largestIdempotent(m);
	}
	return sum;
};

console.time();
console.log(solve(100_000));
console.timeEnd();
debugger;
