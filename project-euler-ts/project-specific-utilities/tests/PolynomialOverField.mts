import { describe, it } from "mocha";
import { Polynomial } from "../PolynomialOverField.mjs";
import { Field } from "../../../utils-ts/modules/math/Field.mjs";
import { assert } from "chai";
import { Rational } from "../../../utils-ts/modules/math/Rational.mjs";

describe("Polynomial.toString", () => {
	it("outputs zero for the zero polynomial", () => {
		const poly = new Polynomial(Field.REALS, []);
		const str = poly.toString();
		assert.equal(str, "0");
	});
	it("stringifies a degree-1 term with a coefficient of 1 as '1'", () => {
		const poly = new Polynomial(Field.REALS, [1]);
		const str = poly.toString();
		assert.equal(str, "1");
	});
	it("stringifies a degree-1 term with a coefficient of -1 as '-1'", () => {
		const poly = new Polynomial(Field.REALS, [1]);
		const str = poly.toString();
		assert.equal(str, "1");
	});
	it("stringifies constant terms without writing the power of x", () => {
		const poly = new Polynomial(Field.REALS, [2]);
		const str = poly.toString();
		assert.equal(str, "2");
	});
	it("stringifies degree-1 terms with an x but without an exponent", () => {
		const poly = new Polynomial(Field.REALS, [0, 2]);
		const str = poly.toString();
		assert.equal(str, "2x");
	});
	it("stringifies ordinary higher-degree terms correctly", () => {
		const poly = new Polynomial(Field.REALS, [0, 0, 3]);
		const str = poly.toString();
		assert.equal(str, "3x^2");
	});
	it("stringifies higher-degree terms with a coefficient of 1 without writing the coefficient", () => {
		const poly = new Polynomial(Field.REALS, [0, 0, 1]);
		const str = poly.toString();
		assert.equal(str, "x^2");
	});
	it("stringifies higher-degree terms with a coefficient of -1 using only a negative sign", () => {
		const poly = new Polynomial(Field.REALS, [0, 0, -1]);
		const str = poly.toString();
		assert.equal(str, "-x^2");
	});
	it("works on polynomials with multiple terms", () => {
		const poly = new Polynomial(Field.REALS, [2, 0, 6, 0, 0, 3]);
		const str = poly.toString();
		assert.equal(str, "2 + 6x^2 + 3x^5");
	});
});

describe("Polynomial.equals", () => {
	it("returns true when the polynomials have exactly the same sequence of coefficients", () => {
		const p1 = new Polynomial(Field.REALS, [2, 3, 1]);
		const p2 = new Polynomial(Field.REALS, [2, 3, 1]);
		assert.isTrue(p1.equals(p2));
		assert.isTrue(p2.equals(p1));
	});
	it("returns true when the polynomials are the same but one has more trailing zeroes", () => {
		const p1 = new Polynomial(Field.REALS, [2, 3, 1, 0]);
		const p2 = new Polynomial(Field.REALS, [2, 3, 1]);
		assert.isTrue(p1.equals(p2));
		assert.isTrue(p2.equals(p1));
	});
	it("returns true when the polynomials' coefficients are the same according to the field's custom equality function", () => {
		const p1 = new Polynomial(Field.RATIONALS, [new Rational(1, 2), new Rational(1, 3)]);
		const p2 = new Polynomial(Field.RATIONALS, [new Rational(1, 2), new Rational(1, 3)]);
		assert.isTrue(p1.equals(p2));
		assert.isTrue(p2.equals(p1));
	});
	it("returns false when the polynomials' coefficients are different", () => {
		const p1 = new Polynomial(Field.REALS, [0, 2, 3, 1]);
		const p2 = new Polynomial(Field.REALS, [2, 3, 1]);
		assert.isFalse(p1.equals(p2));
		assert.isFalse(p2.equals(p1));
	});
});
