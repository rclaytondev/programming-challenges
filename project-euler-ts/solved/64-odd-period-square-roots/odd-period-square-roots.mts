import { Rational } from "../../../utils-ts/modules/math/Rational.mjs";
import { MathUtils } from "../../../utils-ts/modules/math/MathUtils.mjs";
import { ArrayUtils } from "../../../utils-ts/modules/core-extensions/ArrayUtils.mjs";

export class SqrtPlusRational {
	readonly numberInSqrt: number;
	readonly sqrtCoefficient: number;
	readonly rationalPart: number;
	readonly denominator: number;

	constructor(numberInSqrt: number, sqrtCoefficient: number, rationalPart: number, denominator: number) {
		this.numberInSqrt = Math.floor(numberInSqrt);
		this.sqrtCoefficient = Math.floor(sqrtCoefficient);
		this.rationalPart = Math.floor(rationalPart);
		this.denominator = Math.floor(denominator);
	}
	toNumber() {
		return (this.sqrtCoefficient * Math.sqrt(this.numberInSqrt) + this.rationalPart) / this.denominator;
	}
	toString() {
		const firstTerm = (this.sqrtCoefficient === 1) ? `sqrt(${this.numberInSqrt})` : `(${this.sqrtCoefficient}sqrt(${this.numberInSqrt})`;
		const numerator = (
			(this.rationalPart === 0) ? firstTerm
			: (this.rationalPart < 0) ? `${firstTerm} - ${-this.rationalPart}`
			: `${firstTerm} + ${this.rationalPart}`
		);
		return (
			(this.denominator === 1) ? numerator :
			(this.rationalPart === 0) ? `${numerator} / ${this.denominator}`
			: `(${numerator}) / ${this.denominator}`
		);
	}
	simplify() {
		if(this.sqrtCoefficient === 0 && this.rationalPart === 0) {
			return new SqrtPlusRational(this.numberInSqrt, 0, 0, 1);
		}
		const gcd = [this.sqrtCoefficient, this.rationalPart, this.denominator].reduce(
			(a, b) => (a === 0) ? b : ((b === 0) ? a : MathUtils.gcd(a, b)),
		);
		return new SqrtPlusRational(
			this.numberInSqrt,
			this.sqrtCoefficient / gcd,
			this.rationalPart / gcd,
			this.denominator / gcd,
		);
	}

	add(sqrtPlusRational: SqrtPlusRational) {
		if(this.numberInSqrt !== sqrtPlusRational.numberInSqrt) {
			throw new Error("Cannot add numbers in different quadratic fields as the result will not be representable in this format.");
		}

		return new SqrtPlusRational(
			this.numberInSqrt,
			this.sqrtCoefficient * sqrtPlusRational.denominator + sqrtPlusRational.sqrtCoefficient * this.denominator,
			this.rationalPart * sqrtPlusRational.denominator + sqrtPlusRational.rationalPart * this.denominator,
			this.denominator * sqrtPlusRational.denominator,
		);
	}
	opposite() {
		return new SqrtPlusRational(
			this.numberInSqrt,
			-this.sqrtCoefficient,
			-this.rationalPart,
			this.denominator,
		);
	}
	subtract(sqrtPlusRational: SqrtPlusRational) {
		return this.add(sqrtPlusRational.opposite());
	}
	inverse() {
		return new SqrtPlusRational(
			this.numberInSqrt,
			this.sqrtCoefficient * this.denominator,
			-this.rationalPart * this.denominator,
			this.sqrtCoefficient ** 2 * this.numberInSqrt - this.rationalPart ** 2,
		);
	}
	addInteger(integer: number) {
		if(integer !== Math.floor(integer)) {
			throw new Error("Expected input to be an integer.");
		}
		return new SqrtPlusRational(
			this.numberInSqrt,
			this.sqrtCoefficient,
			this.rationalPart + integer * this.denominator,
			this.denominator,
		);
	}
	multiplyByInteger(integer: number) {
		if(integer !== Math.floor(integer)) {
			throw new Error("Expected input to be an integer.");
		}
		return new SqrtPlusRational(
			this.numberInSqrt,
			this.sqrtCoefficient * integer,
			this.rationalPart * integer,
			this.denominator,
		);
	}
	multiplyByRational(rational: Rational) {
		return new SqrtPlusRational(
			this.numberInSqrt,
			this.sqrtCoefficient * rational.numerator,
			this.rationalPart * rational.denominator,
			this.denominator * rational.denominator,
		);
	}

	equals(sqrtPlusRational: SqrtPlusRational) {
		if(sqrtPlusRational.numberInSqrt !== this.numberInSqrt) {
			throw new Error("Comparing SqrtPlusRationals with different values under the square root is not currently suppored.");
		}
		return (
			new Rational(this.sqrtCoefficient, this.denominator).equals(new Rational(sqrtPlusRational.sqrtCoefficient, sqrtPlusRational.denominator))
			&& new Rational(this.rationalPart, this.denominator).equals(new Rational(sqrtPlusRational.rationalPart, sqrtPlusRational.denominator))
		);
	}

	isInteger() {
		const sqrt = Math.floor(Math.sqrt(this.numberInSqrt));
		if(sqrt ** 2 === this.numberInSqrt) {
			return (this.rationalPart + this.sqrtCoefficient * sqrt) % this.denominator === 0;
		}
		return this.numberInSqrt === 0 || this.sqrtCoefficient === 0;
	}
}

export const sqrtContinuedFractionPeriod = (numberInSqrt: number) => {
	const start = new SqrtPlusRational(numberInSqrt, 1, 0, 1);
	const results = [start];
	while(true) {
		const current = results[results.length - 1];
		const fractionalPart = current.addInteger(-Math.floor(current.toNumber()));
		const next = fractionalPart.inverse().simplify();
		const lastEqual = results.findLastIndex(r => r.equals(next));
		if(lastEqual !== -1) {
			return results.length - lastEqual;
		}
		results.push(next);
	}
};

const isSquare = (n: number) => Math.floor(Math.sqrt(n)) ** 2 === n;

export const solve = () => ArrayUtils.range(2, 10000).filter(n => !isSquare(n) && sqrtContinuedFractionPeriod(n) % 2 === 1).length;
