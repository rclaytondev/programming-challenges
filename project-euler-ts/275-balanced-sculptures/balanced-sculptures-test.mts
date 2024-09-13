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
		assert.isNotNull(result);
		assert.deepEqual(result!.leftColumn, new Set([0]));
		assert.deepEqual(result!.rightColumn, new Set([1]));
		assert.isFalse(result!.symmetrical);
		assert.equal(result!.weightDifference, 0);
		assert.equal(result!.blocksLeft, 0);
		assert.equal(result!.maxX, 2);
		assert.sameDeepMembers(result!.components.sets(), [
			new Set([new Vector(-2, 0), new Vector(2, 1)])
		]);
	});
	it("returns null if the resulting sculpture would have disconnected pieces", () => {
		const sculpture = new PartialSculpture({
			leftColumn: new Set([1, 3]),
			rightColumn: new Set([1, 3]),
			symmetrical: true,
			weightDifference: 0,
			blocksLeft: 3,
			maxX: 0,
			components: HashPartition.fromSets([
				[new Vector(0, 1)],
				[new Vector(0, 3)]
			])
		});
		const result = sculpture.getChild([1], [1]);
		assert.isNull(result);
	});
});
