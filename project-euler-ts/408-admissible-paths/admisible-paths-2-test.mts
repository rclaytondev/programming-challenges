import { describe } from "mocha";
import { admissiblePaths, inadmissiblePathsTo, modularCombination } from "./admissible-paths-2.mjs";
import { admissiblePaths as naiveAlgorithm } from "./admissible-paths.mjs";
import { assert } from "chai";
import { MathUtils } from "../../utils-ts/modules/math/MathUtils.mjs";
import { BigintMath } from "../../utils-ts/modules/math/BigintMath.mjs";
import { VectorSet } from "./VectorSet.mjs";
import { Vector } from "../../utils-ts/modules/geometry/Vector.mjs";

describe("admissiblePaths", () => {
	it("can compute the number of admissible paths to (5, 5), which has no inadmissible points", () => {
		const result = admissiblePaths(5, 596994449);
		assert.equal(result, 252n);
	});
	it("can compute the number of admissible paths to (16, 16), which has 1 pair of inadmissible points", () => {
		const result = admissiblePaths(16, 596994449);
		assert.equal(result, 596994440n);
	});
	it("gives the same result as the naive algorithm for (17, 17), which has 1 pair of inadmisible points", () => {
		const result = admissiblePaths(17, 1_000_000_007);
		const expected = naiveAlgorithm(17, 17, 1_000_000_007);
		assert.equal(result, BigInt(expected));
	});
	it("gives the same result as the naive algorithm for (64, 64), which has 2 pairs of inadmissible points", () => {
		const result = admissiblePaths(36, 1_000_000_007);
		const expected = naiveAlgorithm(36, 36, 1_000_000_007);
		assert.equal(result, BigInt(expected));
	});
	it("gives the same result as the naive algorithm for (144, 144), which has 4 pairs of inadmissible points", () => {
		const result = admissiblePaths(144, 1_000_000_007);
		const expected = naiveAlgorithm(144, 144, 1_000_000_007);
		assert.equal(result, BigInt(expected));
	});
});
describe("inadmissiblePathsTo", () => {
	it("works for (10, 10) with inadmissibles (1, 2), (3, 4)", () => {
		const modulo = 1_000_000_007;
		const paths = (x: number, y: number) => modularCombination(x + y, x, modulo);
		const pathsThroughFirst = paths(1, 2) * paths(8, 9);
		const pathsThroughSecond = (paths(3, 4) - paths(1, 2) * paths(2, 2)) * paths(6, 7);
		const expected = (pathsThroughFirst + pathsThroughSecond) % modulo;

		const points = VectorSet.fromIterable([new Vector(1, 2), new Vector(3, 4)]);
		const result = inadmissiblePathsTo(new Vector(10, 10), points, modulo);
		assert.equal(Number(result), expected);
	});
});
describe("modularCombination", () => {
	it("can compute 10 choose 5 mod 37", () => {
		const expected = MathUtils.binomial(10, 5) % 37;
		const actual = modularCombination(10, 5, 37);
		assert.equal(actual, expected);
	});
	it("can compute 32 choose 16 mod 596994449", () => {
		const expected = Number(BigintMath.binomial(32n, 16n) % 596994449n);
		const actual = modularCombination(32, 16, 596994449);
		assert.equal(actual, expected);
	});
});
