import { describe } from "mocha";
import { admissiblePaths, modularCombination } from "./admissible-paths-2.mjs";
import { assert } from "chai";
import { MathUtils } from "../../utils-ts/modules/math/MathUtils.mjs";
import { BigintMath } from "../../utils-ts/modules/math/BigintMath.mjs";

describe("admissiblePaths", () => {
	it("can compute the number of admissible paths to (5, 5)", () => {
		const result = admissiblePaths(5, 596994449);
		assert.equal(result, 252n);
	});
	it("can compute the number of admissible paths to (16, 16)", () => {
		const result = admissiblePaths(16, 596994449);
		assert.equal(result, 596994440n);
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
