import { Polynomial } from "./PolynomialOverField.js";
import { Field } from "../502-counting-castles/Field.js";
import * as bigintMath from "../utils-ts/BigIntMath.js";

class Rational {
	numerator: bigint;
	denominator: bigint;
	constructor(numerator: bigint | number, denominator: bigint | number) {
		this.numerator = BigInt(numerator);
		this.denominator = BigInt(denominator);
	}

	simplify() {
		if(this.numerator === 0n) { return new Rational(0n, 1n); }
		const gcd = bigintMath.gcd(this.numerator, this.denominator);
		return new Rational(this.numerator / gcd, this.denominator / gcd);
	}
	add(rational: Rational) {
		return new Rational(this.numerator * rational.denominator + this.denominator * rational.numerator, this.denominator * rational.denominator).simplify();
	}
	multiply(rational: Rational) {
		return new Rational(this.numerator * rational.numerator, this.denominator * rational.denominator).simplify();
	}
	opposite() {
		return new Rational(-this.numerator, this.denominator);
	}
	inverse() {
		if(this.numerator === 0n) {
			throw new Error("Cannot find the inverse of 0.");
		}
		return new Rational(this.denominator, this.numerator);
	}

	toString() {
		return `${this.numerator} / ${this.denominator}`;
	}
}
const rationals = new Field<Rational>(
	new Rational(0, 1),
	new Rational(1, 1),
	(a, b) => a.add(b),
	(a, b) => a.multiply(b),
	r => r.opposite(),
	r => r.inverse()
);

const POLYNOMIAL = new Polynomial(rationals, [1, -1, 1, -1, 1, -1, 1, -1, 1, -1, 1].map(num => new Rational(num, 1)));
const solve = () => {
	let result = new Rational(0, 1);
	for(let numTerms = 1; numTerms <= POLYNOMIAL.degree(); numTerms ++) {
		const terms = new Array(numTerms).fill(0).map((v, index) => [new Rational(index + 1, 1), POLYNOMIAL.evaluate(new Rational(index + 1, 1))] as [Rational, Rational]);
		const lagrangePolynomial = Polynomial.interpolate(terms, rationals);
		if(lagrangePolynomial.evaluate(new Rational(numTerms + 1, 1)) !== POLYNOMIAL.evaluate(new Rational(numTerms + 1, 1))) {
			result = result.add(lagrangePolynomial.evaluate(new Rational(numTerms + 1, 1)));
		}
	}
	return result;
};
console.log(solve());
