import { describe, it } from "mocha";
import { numLosing } from "./distribunim-1.mjs";
import { assert } from "chai";

describe("numLosing", () => {
	it("can calculate the number of losing states with <=7 coins in each pile", () => {
		const result = numLosing(7);
		assert.equal(result, 21);
	});
	it("can calculate the number of losing states with <=49 coins in each pile", () => {
		const result = numLosing(49);
		assert.equal(result, 221);
	});
});