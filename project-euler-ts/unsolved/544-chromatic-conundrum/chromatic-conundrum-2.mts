import { BigintMath } from "../../../utils-ts/modules/math/BigintMath.mjs";
import { BigRational } from "../../../utils-ts/modules/math/BigRational.mjs";
import { Field } from "../../../utils-ts/modules/math/Field.mjs";
import { Polynomial } from "../../project-specific-utilities/PolynomialOverField.mjs";

export class Problem544 {
	static monomialSum(power: bigint): Polynomial<BigRational> {
		const coefsReversed = [new BigRational(1n, power + 1n)];
		for(let i = power - 1n; i >= 0; i --) {
			let coef = new BigRational(0);
			for(let k = i + 2n; k <= power + 1n; k ++) {
				const sign = (k % 2n === i % 2n) ? 1n : -1n;
				coef = coef.add(
					new BigRational(sign * BigintMath.binomial(k, i))
					.multiply(coefsReversed[coefsReversed.length - 1 - Number(k - (i + 2n))]),
				);
			}
			coef = coef.multiply(new BigRational(1n, i + 1n));
			coefsReversed.push(coef);
		}
		return new Polynomial(Field.BIG_RATIONALS, [
			new BigRational(0n),
			...coefsReversed.toReversed(),
		]);
	}
}
