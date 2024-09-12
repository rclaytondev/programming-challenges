import { it } from "mocha";
import { PartialSculpture } from "./balanced-sculptures.mjs";
import { assert } from "chai";

describe("PartialSculpture.getChild", () => {
	it("returns the new partial sculpture with the given columns added to the left and right", () => {
		// example sculpture used in test: left of #17 in the image from Project Euler
		const sculpture = new PartialSculpture(
			new Set([0]),
			new Set([1]),
			false,
			0,
			2,
			1,
			new Set([new Set([["left", 0], ["right", 1]])])
		);
		const result = sculpture.getChild([0], [1]);
		const expected = new PartialSculpture(
			new Set([0]),
			new Set([1]),
			false,
			0,
			0,
			2,
			new Set([new Set([["left", 0], ["right", 1]])])
		);
		assert.deepEqual(result, expected);
	});
});
