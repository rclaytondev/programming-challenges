import { MathUtils } from "../../utils-ts/modules/math/MathUtils.mjs";

export const roundness = (num: number) => {
	let total = 0;
	for(const divisor of MathUtils.divisors(num).filter(d => d !== 1)) {
		let exponent = 1;
		while(num % (divisor ** exponent) === 0) {
			exponent ++;
		}
		exponent --;
		total += exponent;
	}
	return total;
};
