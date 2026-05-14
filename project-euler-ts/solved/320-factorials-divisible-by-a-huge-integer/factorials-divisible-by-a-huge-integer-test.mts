import { describe } from "mocha";
import { Factorization } from "../../../utils-ts/modules/math/Factorization.mjs";
import { factorialDivisibilitySum, minDivisible, smallestFactorialDivisible } from "./factorials-divisible-by-a-huge-integer.mjs";
import { assert } from "chai";

describe("smallestFactorialDivisible", () => {
	const isBigEnough = (num: number, base: number, exponent: number) => {
		/*
		Returns whether `num`! is divisible by (`base`!) ** `exponent`.
		*/
		const target = Factorization.factorial(base).exponentiate(exponent);
		const value = new Factorization(new Map(target.factors().map(p => [p, Factorization.exponentInFactorial(num, p)])));
		return target.divides(value);
	};


	it("returns the smallest integer n such that n! is divisible by (`base`!) ** `exponent`", () => {
		const answer = smallestFactorialDivisible(1000, 1234567890);
		assert.isTrue(isBigEnough(Number(answer), 1000, 1234567890), "expected the answer to be big enough");
		assert.isFalse(isBigEnough(Number(answer) - 1, 1000, 1234567890), "expected the answer to be minimal");
	});
	it("works for 10", () => {
		const answer = smallestFactorialDivisible(10, 1234567890);
		assert.isTrue(isBigEnough(Number(answer), 10, 1234567890), "expected the answer to be big enough");
		assert.isFalse(isBigEnough(Number(answer) - 1, 10, 1234567890), "expected the answer to be minimal");
	});
});

describe("factorialDivisibilitySum", () => {
	it("works for the large example from Project Euler (input of 1000)", () => {
		const result = factorialDivisibilitySum(10, 1000, 1234567890);
		assert.equal(result, 614538266565663n);
	});
});

describe("minDivisible", () => {
	const isBigEnough = (n: number, prime: number, exponent: number) => Factorization.exponentInFactorial(n, prime) >= exponent;

	it("returns the smallest n such that n! is divisible by `prime` ** `exponent`", () =>{
		const answer = Number(minDivisible(2, 9876543134));
		assert.isTrue(isBigEnough(answer, 2, 9876543134), "expected the answer to be big enough");
		assert.isFalse(isBigEnough(answer - 1, 2, 9876543134), "expected the answer to be minimal");
	});
	it("works for a large test case", () =>{
		const answer = Number(minDivisible(2, 9876543120));
		assert.isTrue(isBigEnough(answer, 2, 9876543120), "expected the answer to be big enough");
		assert.isFalse(isBigEnough(answer - 1, 2, 9876543120), "expected the answer to be minimal");
	});
});
