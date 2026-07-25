import { describe } from "mocha";
import { Problem544 } from "./chromatic-conundrum.mjs";
import { assert } from "chai";
import { Polynomial } from "../../project-specific-utilities/PolynomialOverField.mjs";
import { Field } from "../../../utils-ts/modules/math/Field.mjs";
import { BigRational } from "../../../utils-ts/modules/math/BigRational.mjs";

describe("Problem544.monomialSum", () => {
	it("can compute the polynomial for 1 + 1 + 1 + ... + 1", () => {
		const actual = Problem544.monomialSum(0n);
		const expected = new Polynomial(Field.BIG_RATIONALS, [
			new BigRational(0n), new BigRational(1n),
		]);
		assert.isTrue(actual.equals(expected));
	});
	it("can compute the polynomial for 1 + 2 + ... + x", () => {
		const actual = Problem544.monomialSum(1n);
		const expected = new Polynomial(Field.BIG_RATIONALS, [
			new BigRational(0n), new BigRational(1n, 2n), new BigRational(1n, 2n),
		]);
		assert.isTrue(actual.equals(expected));
	});
	it("can compute the polynomial for 1^2 + 2^2 + 3^2 + ... + x^2", () => {
		const actual = Problem544.monomialSum(2n);
		const expected = new Polynomial(Field.BIG_RATIONALS, [
			new BigRational(0n), new BigRational(1n, 6n), new BigRational(1n, 2n), new BigRational(1n, 3n),
		]);
		assert.isTrue(actual.equals(expected));
	});
	it("can compute the polynomial for 1^3 + 2^3 + 3^3 + ... + x^3", () => {
		const polynomial = Problem544.monomialSum(3n);
		assert.deepEqual(polynomial.evaluate(new BigRational(1n)), new BigRational(1n));
		assert.deepEqual(polynomial.evaluate(new BigRational(2n)), new BigRational(1n + 8n));
		assert.deepEqual(polynomial.evaluate(new BigRational(3n)), new BigRational(1n + 8n + 27n));
		assert.deepEqual(polynomial.evaluate(new BigRational(4n)), new BigRational(1n + 8n + 27n + 64n));
	});
});

describe("Problem544.polynomialSum", () => {
	it("returns a new polynomial f such that f(x) = g(1) + g(2) + ... + g(x), where g is the given polynomial", () => {
		const polynomial = new Polynomial(Field.BIG_RATIONALS, [
			new BigRational(2n),
			new BigRational(1n, 3n),
			new BigRational(0n),
			new BigRational(-4n),
		]);
		const sum = Problem544.polynomialSum(polynomial);
		assert.deepEqual(
			sum.evaluate(new BigRational(1n)),

			polynomial.evaluate(new BigRational(1n)),
		);
		assert.deepEqual(
			sum.evaluate(new BigRational(2n)),
			
			polynomial.evaluate(new BigRational(1n))
			.add(polynomial.evaluate(new BigRational(2n))),
		);
		assert.deepEqual(
			sum.evaluate(new BigRational(3n)),

			polynomial.evaluate(new BigRational(1n))
			.add(polynomial.evaluate(new BigRational(2n)))
			.add(polynomial.evaluate(new BigRational(3n))),
		);
	});
});
