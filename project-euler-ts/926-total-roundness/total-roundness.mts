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

for(let i = 2; i < 100; i ++) {
	for(let j = 2; j < 100; j ++) {
		if(MathUtils.gcd(i, j) === 1) {
			const actual = roundness(i * j);
			const expected = (roundness(i) + 1) * (roundness(j) + 1) - 1;
			if(actual !== expected) {
				debugger;
			}
		}
	}
}
