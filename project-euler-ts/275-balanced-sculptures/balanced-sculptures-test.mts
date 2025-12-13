import { describe, it } from "mocha";
import { PartialSculpture } from "./balanced-sculptures.mjs";
import { assert } from "chai";

describe("PartialSculpture.numSculptures", () => {
	it("correctly counts the balanced sculptures of order 1", () => {
		const result = PartialSculpture.numSculptures(1);
		assert.equal(result, 1);
	});
	it("correctly counts the balanced sculptures of order 2", () => {
		const result = PartialSculpture.numSculptures(2);
		assert.equal(result, 1);
	});
	it("correctly counts the balanced sculptures of order 3", () => {
		const result = PartialSculpture.numSculptures(3);
		assert.equal(result, 2); // 2 sculptures: vertical sculpture and a T-shape
	});
	it("correctly counts the balanced sculptures of order 4", () => {
		const result = PartialSculpture.numSculptures(4);
		assert.equal(result, 4);
	});
	it("correctly counts the balanced sculptures of order 5", () => {
		const result = PartialSculpture.numSculptures(5);
		assert.equal(result, 9);
	});
});
