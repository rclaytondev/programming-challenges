import { it } from "mocha";
import { PartialSculpture } from "./balanced-sculptures.mjs";
import { assert } from "chai";
import { HashPartition } from "./HashPartition.mjs";
import { Vector } from "../../utils-ts/modules/geometry/Vector.mjs";

describe("PartialSculpture.getChild", () => {
	it("returns the new partial sculpture with the given columns added to the left and right", () => {
		// example sculpture used in test: left of #17 in the image from Project Euler
		const sculpture = new PartialSculpture({
			leftColumn: new Set([0]),
			rightColumn: new Set([1]),
			symmetrical: false,
			weightDifference: 0,
			blocksLeft: 2,
			maxX: 1,
			components: HashPartition.fromSets<Vector>([[new Vector(-1, 0), new Vector(1, 1)]])
		});
		const result = sculpture.getChild([0], [1]);
		const expected = new PartialSculpture({
			leftColumn: new Set([0]),
			rightColumn: new Set([1]),
			symmetrical: false,
			weightDifference: 0,
			blocksLeft: 0,
			maxX: 2,
			components: HashPartition.fromSets<Vector>([[new Vector(-2, 0), new Vector(2, 1)]])
		});
		assert.deepEqual(result, expected);
	});
});
