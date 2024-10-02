import { describe } from "mocha";
import { naiveNumSemiprimes } from "./naive-algorithm.mjs";
import { assert } from "chai";

describe("naiveNumSemiprimes", () => {
	it("can find the number of semiprimes under 30", () => {
		const result = naiveNumSemiprimes(30);
		assert.equal(result, 10);
	});
});
