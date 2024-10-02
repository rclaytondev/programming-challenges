import { describe } from "mocha";
import { numSemiprimes } from "./semiprimes.mjs";
import { assert } from "chai";

describe("numSemiprimes", () => {
	it("can find the number of semiprimes under 30", () => {
		const result = numSemiprimes(30);
		assert.equal(result, 10);
	});
});
