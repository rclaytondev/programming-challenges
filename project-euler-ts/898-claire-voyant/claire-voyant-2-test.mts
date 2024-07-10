import { describe, it } from "mocha";
import { naiveProbabilitySum, probabilitySum } from "./claire-voyant-2.mjs";
import { assert } from "chai";
import { Rational } from "../../utils-ts/modules/math/Rational.mjs";

describe("probabilitySum", () => {
	it("returns the same result as the naive algorithm for a test case with 2 probabilities", () => {
		const expected = naiveProbabilitySum([new Rational(20, 100), new Rational(40, 100)], new Rational(60, 100));
		const actual = probabilitySum([new Rational(20, 100), new Rational(40, 100)], new Rational(60, 100));
		assert.deepEqual(actual, expected);
	});
	it("returns the same result as the naive algorithm for a test case with 3 probabilities", () => {
		const expected = naiveProbabilitySum([new Rational(20, 100), new Rational(40, 100), new Rational(60, 100)], new Rational(80, 100));
		const actual = probabilitySum([new Rational(20, 100), new Rational(40, 100), new Rational(60, 100)], new Rational(80, 100));
		assert.deepEqual(actual, expected);
	});
});
