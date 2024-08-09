import { MathUtils } from "../../utils-ts/modules/math/MathUtils.mjs";
import { Rational } from "../../utils-ts/modules/math/Rational.mjs";

const solve = (lowerBound: Rational, upperBound: Rational, maxDenominator: number) => {
	let result = 0;
	for(let denominator = 1; denominator <= maxDenominator; denominator ++) {
		const minNumerator = Math.floor(denominator * lowerBound.toNumber()) + 1;
		const maxNumerator = Math.ceil(denominator * upperBound.toNumber()) - 1;
		for(let numerator = minNumerator; numerator <= maxNumerator; numerator ++) {
			if(MathUtils.gcd(numerator, denominator) === 1) {
				result ++;
			}
		}
	}
	return result;
};
// console.log(solve(new Rational(1, 3), new Rational(1, 2), 12000));
// debugger;
