import { MathUtils } from "../../utils-ts/modules/math/MathUtils.mjs";

export const isChainLength = (num: number, length: number) => {
	const results = [num];
	while(results.length <= length) {
		const next = MathUtils.sum(MathUtils.digits(results[results.length - 1]).map(MathUtils.factorial));
		if(results.includes(next)) {
			return results.length === length;
		}
		results.push(next);
	}
	return false;
};

const solve = (upperBound: number = 1000000, length: number = 60) => {
	let result = 0;
	for(let i = 1; i < upperBound; i ++) {
		if(isChainLength(i, length)) {
			result ++;
		}
	}
	return result;
};
// console.log(solve());
// debugger;
