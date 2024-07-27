import { assert } from "chai";
import { describe, it } from "mocha";
import { solve } from "./divisible-ranges.mjs";

describe("solve", () => {
	it("returns 6 when given 4", () => {
		assert.equal(solve(4), 6);
	});
});
