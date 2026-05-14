import { describe } from "mocha";
import { Sequence } from "../../../utils-ts/modules/math/Sequence.mjs";
import { naivePalindromes, palindromes, sumsOfSquareAndCube } from "./sum-of-square-and-cube.mjs";
import { assert } from "chai";

describe("palindromes", () => {
	it("yields all palindromes in increasing numerical order, returning the same result as the naive algorithm", () => {
		const result = new Sequence(palindromes).slice(0, 50);
		const expected = new Sequence(naivePalindromes).slice(0, 50);
		assert.sameOrderedMembers(result, expected);
	});
});

describe("sumsOfSquareAndCube", () => {
	it("returns the list of all ways the given number can be expressed as the sum of a square >1 and a cube >1", () => {
		const ways = sumsOfSquareAndCube(5229225);
		assert.sameDeepMembers(ways, [
			[2285 ** 2, 20 ** 3],
			[2223 ** 2, 66 ** 3],
			[1810 ** 2, 125 ** 3],
			[1197 ** 2, 156 ** 3],
		]);
	});
	it("does not count ways where the cube is 1", () => {
		const ways = sumsOfSquareAndCube(5);
		assert.equal(ways.length, 0);
	});
	it("does not count ways where the square is 1", () => {
		const ways = sumsOfSquareAndCube(9);
		assert.equal(ways.length, 0);
	});
	it("does not count duplicate ways when the summands are both squares and cubes", () => {
		const ways = sumsOfSquareAndCube(2 ** 6 + 3 ** 6);
		assert.equal(ways.length, 1);
	});
});
