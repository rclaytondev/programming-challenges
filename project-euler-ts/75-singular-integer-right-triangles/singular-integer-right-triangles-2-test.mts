import { describe, it } from "mocha";
import { solve } from "./singular-integer-right-triangles-2.mjs";
import { assert } from "chai";

describe("solve", () => {
	it("gives the same result as the naive algorithm for 1000", () => {
		const result = solve(1000);
		assert.equal(result, 110);
	});
});
