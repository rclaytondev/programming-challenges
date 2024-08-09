import { MathUtils } from "../../utils-ts/modules/math/MathUtils.mjs";

const solve = (upperBound: number = 1000000) => {
	let maxValue = 0;
	let maxRatio = -Infinity;
	for(let n = 2; n <= upperBound; n ++) {
		const ratio = n / MathUtils.totient(n);
		if(ratio > maxRatio) {
			maxRatio = ratio;
			maxValue = n;
		}
	}
	return maxValue;
};
// console.log(solve());
// debugger;
