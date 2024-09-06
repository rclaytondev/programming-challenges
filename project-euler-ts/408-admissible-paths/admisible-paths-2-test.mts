import { describe } from "mocha";
import { admissiblePaths } from "./admissible-paths-2.mjs";
import { assert } from "chai";

describe("admissiblePaths", () => {
	it("can compute the number of admissible paths to (5, 5)", () => {
		const result = admissiblePaths(5);
		assert.equal(result, 252n);
	});
	it("can compute the number of admissible paths to (16, 16)", () => {
		const result = admissiblePaths(16);
		assert.equal(result, 596994440n);
	});
});
