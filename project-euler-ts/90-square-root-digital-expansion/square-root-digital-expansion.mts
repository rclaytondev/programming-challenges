import { BigintMath } from "../../utils-ts/modules/math/BigintMath.mjs";
import { BigRational } from "../../utils-ts/modules/math/BigRational.mjs";
import { MathUtils } from "../../utils-ts/modules/math/MathUtils.mjs";

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

export const fromDigits = (integerPart: number, digits: number[]) => new BigRational(
	BigInt(integerPart) * (10n ** BigInt(digits.length)) + BigintMath.sum(digits.map((d, i) => BigInt(d) * (10n ** BigInt((digits.length - i - 1))))),
	10n ** BigInt(digits.length)
);

export const sqrtDigits = (num: number, numDigits: number) => {
	const integerPart = Math.floor(Math.sqrt(num));
	const integerPartDigits = MathUtils.digits(integerPart).length;
	const digits: number[] = [];
	while(integerPartDigits + digits.length < numDigits) {
		const nextDigit = DIGITS.findLast(d => 
			fromDigits(integerPart, [...digits, d]).square().isLessThanOrEqualTo(new BigRational(num)));
		digits.push(nextDigit!);
	}
	return [...MathUtils.digits(integerPart), ...digits];
};

const solve = () => {
	let result = 0;
	for(let n = 1; n <= 100; n ++) {
		if(Math.sqrt(n) % 1 !== 0) {
			result += MathUtils.sum(sqrtDigits(n, 100));
		}
	}
	return result;
};
// console.log(solve());
// debugger;
