import { describe } from "mocha";
import { admissiblePaths } from "./admissible-paths.mjs";
import { assert } from "chai";

describe("admissiblePaths", () => {
	it("can compute the number of admissible paths to (5, 5)", () => {
		const result = admissiblePaths(5, 1000);
		assert.equal(result, 252);
	});
	it("can compute the number of admissible paths to (16, 16)", () => {
		const result = admissiblePaths(16, 1000000000);
		assert.equal(result, 596994440);
	});
});
