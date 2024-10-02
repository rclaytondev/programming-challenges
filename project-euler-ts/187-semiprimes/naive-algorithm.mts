import { MathUtils } from "../../utils-ts/modules/math/MathUtils.mjs";

const isSemiprime = (num: number) => {
	const factors = MathUtils.factorsWithMultiplicity(num);
	return factors.length === 2;
};

export const naiveNumSemiprimes = (upperBound: number) => {
	let count = 0;
	for(let i = 0; i < upperBound; i ++) {
		if(isSemiprime(i)) { count ++; }
	}
	return count;
};
