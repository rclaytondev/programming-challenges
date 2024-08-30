import { MathUtils } from "../../utils-ts/modules/math/MathUtils.mjs";
import { Utils } from "../../utils-ts/modules/Utils.mjs";
import { CountLogger } from "../project-specific-utilities/CountLogger.mjs";

export const getChainEnd = Utils.memoize((num: number): number => {
	if(num === 1 || num === 89) {
		return num;
	}
	return getChainEnd(MathUtils.sum(MathUtils.digits(num).map(d => d ** 2)));
});
const solve = (upperBound: number) => {
	// const logger = new CountLogger(n => 1000 * n, upperBound);
	let count = 0;
	for(let n = 1; n < upperBound; n ++) {
		// logger.count();
		if(getChainEnd(n) === 89) {
			count ++;
		}
	}
	return count;
};

// console.time();
// console.log(solve(10000000));
// console.timeEnd();
// debugger;
