import { MathUtils } from "../../utils-ts/modules/math/MathUtils.mjs";
import { Sequence } from "../../utils-ts/modules/math/Sequence.mjs";
import { Utils } from "../../utils-ts/modules/Utils.mjs";

const valuationSum = Utils.memoize((maximum: number, remainingExponents: number[]): number => {
	if(maximum === 1) {
		return MathUtils.product(remainingExponents.map(e => e + 1));
	}
	if(remainingExponents.length === 0) {
		return (maximum === Infinity) ? 0 : maximum;
	}
	let result = 0;
	const nextExponents = remainingExponents.slice(1);
	for(let i = 0; i <= remainingExponents[0]; i ++) {
		result += valuationSum(
			Math.min(maximum, Math.floor(remainingExponents[0] / i)),
			nextExponents
		);
	}
	return result;
});

export const roundness = (num: number) => {
	const exponents = [...MathUtils.factorize(num).values()];
	return valuationSum(Infinity, exponents);
};

export const factorialRoundness = (num: number) => {
	const primes = [...Sequence.PRIMES.termsBelow(num)];
	const exponents = primes.map(p => {
		let exponent = 0;
		for(let k = 1; p ** k <= num; k ++) {
			exponent += Math.floor(num / (p ** k));
		}
		return exponent;
	});
	return valuationSum(Infinity, exponents);
};


console.time();
console.log(factorialRoundness(2000));
console.timeEnd();
debugger;
