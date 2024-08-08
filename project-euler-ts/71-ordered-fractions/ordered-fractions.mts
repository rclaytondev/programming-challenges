import { Rational } from "../../utils-ts/modules/math/Rational.mjs";

const TARGET = new Rational(3, 7);
const UPPER_BOUND = 1000000;

const solve = () => {
	let fractions = [];
	for(let denominator = 1; denominator <= UPPER_BOUND; denominator ++) {
		let numerator = Number(BigInt(TARGET.numerator * denominator) / BigInt(TARGET.denominator));
		if(new Rational(numerator, denominator).equals(TARGET)) {
			numerator --;
		}

		fractions.push(new Rational(numerator, denominator));
	}
	const result = fractions.sort((a, b) => a.compare(b));
	return result[result.length - 1];
};
// console.log(solve());
// debugger;
