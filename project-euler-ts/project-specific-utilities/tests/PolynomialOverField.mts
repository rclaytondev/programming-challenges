import { describe, it } from "mocha";
import { Polynomial } from "../PolynomialOverField.mjs";
import { Field } from "../../../utils-ts/modules/math/Field.mjs";
import { assert } from "chai";

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
