import { MathUtils } from "../../utils-ts/modules/math/MathUtils.mjs";

const valuationSum = (maximum: number, remainingExponents: number[]): number => {
	if(remainingExponents.length === 0) {
		return (maximum === Infinity) ? 0 : maximum;
	}
	let result = 0;
	const nextExponents = remainingExponents.slice(1);
	for(let i = 0; i <= remainingExponents[0]; i ++) {
		result += valuationSum(
			Math.min(maximum, remainingExponents[0] / i),
			nextExponents
		);
	}
	return result;
};

export const roundness = (num: number) => {
	const exponents = [...MathUtils.factorize(num).values()];
	return valuationSum(Infinity, exponents);
};
