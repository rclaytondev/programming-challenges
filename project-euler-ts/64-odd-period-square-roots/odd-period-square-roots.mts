import { assert } from "chai";

class SqrtPlusRational {
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
		return (this.denominator === 1) ? numerator : `${numerator} / ${this.denominator}`;
	}

	inverse() {
		return new SqrtPlusRational(
			this.numberInSqrt,
			this.sqrtCoefficient * this.denominator,
			-this.rationalPart * this.denominator,
			this.sqrtCoefficient ** 2 * this.numberInSqrt - this.rationalPart ** 2
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
			this.denominator
		);
	}

	equals(sqrtPlusRational: SqrtPlusRational) {
		return this.toNumber() === sqrtPlusRational.toNumber();
	}
}

const sqrtContinuedFractionPeriod = (numberInSqrt: number) => {
	const start = new SqrtPlusRational(numberInSqrt, 1, 0, 1);
	const results = [start];
	while(true) {
		const current = results[results.length - 1];
		const fractionalPart = current.addInteger(-Math.floor(current.toNumber()));
		const next = fractionalPart.inverse();
		const lastEqual = results.findLastIndex(r => r.equals(next));
		if(lastEqual !== -1) {
			return results.length - lastEqual;
		}
		results.push(next);
	}
};

describe("sqrtContinuedFractionPeriod", () => {
	const cases: [number, number][] = [
		[2, 1],
		[3, 2],
		[5, 1],
		[6, 2],
		[7, 4],
		[8, 2],
		[10, 1],
		[11, 2],
		[12, 2],
		[13, 5],
	];
	for(const [input, expected] of cases) {
		it(`outputs ${expected} for an input of ${input}`, () => {
			const result = sqrtContinuedFractionPeriod(input);
			assert.equal(result, expected);
		});
	}
});
