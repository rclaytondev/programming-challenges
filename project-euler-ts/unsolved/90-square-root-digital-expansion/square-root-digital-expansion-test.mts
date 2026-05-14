import { describe } from "mocha";
import { fromDigits, sqrtDigits } from "./square-root-digital-expansion.mjs";
import { assert } from "chai";

describe("fromDigits", () => {
	it("can return the BigRational with an integer part of 123 and a decimal part of 0.4567", () => {
		const rational = fromDigits(123, [4, 5, 6, 7]);
		assert.equal(Number(rational.numerator) / Number(rational.denominator), 123.4567);
	});
	it("can return the BigRational with an integer part of 123 and a decimal part of 0.45", () => {
		const rational = fromDigits(123, [4, 5]);
		assert.equal(Number(rational.numerator) / Number(rational.denominator), 123.45);
	});
});
describe("sqrtDigits", () => {
	it("can return the first 10 digit of sqrt(2)", () => {
		const result = sqrtDigits(2, 10);
		assert.deepEqual(result, [1, 4, 1, 4, 2, 1, 3, 5, 6, 2]);
	});
});
