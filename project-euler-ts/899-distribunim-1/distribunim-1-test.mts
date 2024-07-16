import { describe, it } from "mocha";
import { numLosing } from "./distribunim-1.mjs";
import { assert } from "chai";

describe("numLosing", () => {
	it("can calculate the number of losing states with <=7 coins in each pile", () => {
		const result = numLosing(7n);
		assert.equal(result, 21n);
	});
	it("can calculate the number of losing states with <=49 coins in each pile", () => {
		const result = numLosing(49n);
		assert.equal(result, 221n);
	});
});
