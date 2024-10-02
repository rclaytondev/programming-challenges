import { describe } from "mocha";
import { numSemiprimes } from "./semiprimes.mjs";
import { assert } from "chai";
import { naiveNumSemiprimes } from "./naive-algorithm.mjs";

describe("numSemiprimes", () => {
	it("can find the number of semiprimes under 30", () => {
		const result = numSemiprimes(30);
		assert.equal(result, 10);
	});
	it("returns the same result as the naive algorithm for 1000", () => {
		const expected = naiveNumSemiprimes(1000);
		const result = numSemiprimes(1000);
		assert.equal(result, expected);
	});
});
