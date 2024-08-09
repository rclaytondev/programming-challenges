import { MathUtils } from "../../utils-ts/modules/math/MathUtils.mjs";

const solve = (upperBound: number = 1000000) => {
	let result = 0;
	for(let denominator = 2; denominator <= upperBound; denominator ++) {
		result += MathUtils.totient(denominator);
	}
	return result;
};

// console.log(solve());
// debugger;
