import { describe } from "mocha";
import { Problem94 } from "./almost-equilateral-triangles.mjs";
import { assert } from "chai";
import { Problem94NaiveSolution } from "./almost-equilateral-triangles-naive.mjs";

describe("Problem94.solve", () => {
	it("gives the same result as the naive algorithm for n=25", () => {
		const result = BigInt(Problem94.solve(25));
		const expected = BigInt(Problem94NaiveSolution.solve(25));
		assert.equal(result, expected);
	});
	it("gives the same result as the naive algorithm for n=100", () => {
		const result = BigInt(Problem94.solve(100));
		const expected = BigInt(Problem94NaiveSolution.solve(100));
		assert.equal(result, expected);
	});
	it("gives the same result as the naive algorithm for n=10000", () => {
		const result = BigInt(Problem94.solve(10000));
		const expected = BigInt(Problem94NaiveSolution.solve(10000));
		assert.equal(result, expected);
	});
	it("gives the same result as the naive algorithm for n=100,000", () => {
		const result = BigInt(Problem94.solve(100_000));
		const expected = BigInt(Problem94NaiveSolution.solve(100_000));
		assert.equal(result, expected);
	});
});
