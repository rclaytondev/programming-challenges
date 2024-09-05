import { MathUtils } from "../../utils-ts/modules/math/MathUtils.mjs";
import { Sequence } from "../../utils-ts/modules/math/Sequence.mjs";
import { CountLogger } from "../project-specific-utilities/CountLogger.mjs";

export const divisorSumSum = (upperBound: number) => {
	const counter = new CountLogger(n => 10 * n, upperBound);
	let result = upperBound ** 2;
	for(let i = 1; i <= upperBound; i ++) {
		counter.count();
		let divisorValues = new Set<number>([1]);
		// debugger;
		for(const prime of Sequence.PRIMES) {
			const newDivisorValues = new Set<number>();
			for(const value of divisorValues) {
				for(let exponent = 1; value * prime ** exponent <= upperBound * i; exponent ++) {
					const newValue = value * prime ** exponent;
					const term = Math.floor(upperBound * MathUtils.gcd(i, newValue) / newValue) * newValue;
					// console.log(`${newValue} is a divisor of ${Math.floor(upperBound * MathUtils.gcd(i, newValue) / newValue)} values of the form ${i} * j for some j <= ${upperBound}, contributing a total of ${term} to the sum.`);
					result += term;
					if(term !== 0) {
						newDivisorValues.add(newValue);
					}
					else { break; }
				}
			}
			for(const newValue of newDivisorValues) {
				divisorValues.add(newValue);
			}
			if(prime > upperBound * i) { break; }
		}
	}
	// debugger;
	return result;
};

// console.time();
// console.log(divisorSumSum(1000));
// console.timeEnd();
// debugger;
