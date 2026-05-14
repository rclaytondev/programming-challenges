import { assert } from "chai";
import { describe, it } from "mocha";
import { getAmicableLoop } from "./amicable-chains.mjs";

describe("getAmicableLoop", () => {
	it("returns the cycle of the divisor-sum function starting at the given number, if it exists", () => {
		assert.deepEqual(getAmicableLoop(12496, 1000000), [12496, 14288, 15472, 14536, 14264]);
	});
	it("returns null if iterating the function produces a number above the upper bound", () => {
		assert.isNull(getAmicableLoop(1000000, 100000));
	});
});
