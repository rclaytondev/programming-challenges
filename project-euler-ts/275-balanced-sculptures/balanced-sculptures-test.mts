import { describe, it } from "mocha";
import { balancedSculptures, PartialSculpture } from "./balanced-sculptures.mjs";
import { assert } from "chai";
import { HashPartition } from "./HashPartition.mjs";
import { Vector } from "../../utils-ts/modules/geometry/Vector.mjs";
import { HashSet } from "../../utils-ts/modules/HashSet.mjs";

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
describe("balancedSculptures", () => {
	it("correctly counts the balanced sculptures of order 1", () => {
		const result = balancedSculptures(1);
		assert.equal(result, 1);
	});
	it("correctly counts the balanced sculptures of order 2", () => {
		const result = balancedSculptures(2);
		assert.equal(result, 1);
	});
	it("correctly counts the balanced sculptures of order 3", () => {
		const result = balancedSculptures(3);
		assert.equal(result, 2); // 2 sculptures: vertical sculpture and a T-shape
	});
	it("correctly counts the balanced sculptures of order 4", () => {
		const result = balancedSculptures(4);
		assert.equal(result, 4);
	});
	it("correctly counts the balanced sculptures of order 5", () => {
		const result = balancedSculptures(5);
		assert.equal(result, 9);
	});

	it("can correctly compute the list of sculptures of order 2", () => {
		const result = new HashSet(PartialSculpture.allSculptures(2));
		const expected = [
			new HashSet([ new Vector(0, 0), new Vector(0, 1) ])
		];
		assert.isTrue(new HashSet(result).equals(new HashSet(expected)));
	});
	it("can compute the list of all the sculptures with 3 non-plinth blocks", () => {
		const result = new HashSet(PartialSculpture.allSculptures(3));
		const VERTICAL = new HashSet([ new Vector(0, 0), new Vector(0, 1), new Vector(0, 2) ]);
		const T_SHAPE = new HashSet([ new Vector(0, 0), new Vector(-1, 0), new Vector(1, 0) ]);
		assert.isTrue(new HashSet(result).equals(new HashSet([T_SHAPE, VERTICAL])));
	});
	it("can compute the list of all the sculptures with 4 non-plinth blocks", () => {
		const result = new HashSet(PartialSculpture.allSculptures(4));
		const VERTICAL = new HashSet([ new Vector(0, 0), new Vector(0, 1), new Vector(0, 2), new Vector(0, 3) ]);
		const UPSIDE_DOWN_T = new HashSet([ new Vector(0, 0), new Vector(0, 1), new Vector(-1, 0), new Vector(1, 0) ]);
		const Z_SHAPE_1 = new HashSet([ new Vector(0, 0), new Vector(0, 1), new Vector(-1, 0), new Vector(1, 1) ]);
		const Z_SHAPE_2 = new HashSet([ new Vector(0, 0), new Vector(0, 1), new Vector(-1, 1), new Vector(1, 0) ]);
		const T_SHAPE = new HashSet([ new Vector(0, 0), new Vector(0, 1), new Vector(-1, 1), new Vector(1, 1) ]);
		const expected = new HashSet([VERTICAL, UPSIDE_DOWN_T, Z_SHAPE_1, Z_SHAPE_2, T_SHAPE]);
		assert.isTrue(result.equals(expected));
	});

	// test cases from Project Euler
	it("correctly counts the balanced sculptures of order 6", () => {
		const result = balancedSculptures(6);
		assert.equal(result, 18);
	});
	// it("correctly counts the balanced sculptures of order 10", () => {
	// 	const result = balancedSculptures(10);
	// 	assert.equal(result, 964);
	// });
	// it("correctly counts the balanced sculptures of order 15", () => {
	// 	const result = balancedSculptures(15);
	// 	assert.equal(result, 360505);
	// });
});
describe("PartialSculpture.nextBlockCounts", () => {
	it("works even when one of the outer columns is empty", () => {
		// example sculpture: L-shape with 6 blocks stacked vertically, 1 tile to the left of the plinth, and 3 tiles arranged horizontally extending to the right, 1 tile above the plinth
		const sculpture = new PartialSculpture({
			leftColumn: new Set([]),
			rightColumn: new Set([1]),
			symmetrical: false,
			weightDifference: -3,
			blocksLeft: 1,
			maxX: 2,
			components: HashPartition.fromSets([[new Vector(2, 1)]])
		});
		const nextBlockCounts = sculpture.nextBlockCounts();
		assert.isNotEmpty(nextBlockCounts);
	});
});
describe("PartialSculpture.children", () => {
	it("works even when one of the outer columns is empty", () => {
		const sculpture = new PartialSculpture({
			leftColumn: new Set([]),
			rightColumn: new Set([1]),
			symmetrical: false,
			weightDifference: -3,
			blocksLeft: 1,
			maxX: 2,
			components: HashPartition.fromSets([[new Vector(2, 1)]])
		});
		const children = sculpture.children();
		assert.equal(children.length, 1);
		const [child] = children;
		assert.deepEqual(child.leftColumn, new Set([]));
		assert.deepEqual(child.rightColumn, new Set([1]));
		assert.deepEqual(child.symmetrical, false);
		assert.deepEqual(child.weightDifference, 0);
		assert.deepEqual(child.blocksLeft, 0);
		assert.deepEqual(child.maxX, 3);
		assert.sameDeepMembers(child.components.sets(), [
			new Set([new Vector(3, 1)])
		]);
	});
});
describe("PartialSculpture.canBeBalanced", () => {
	it("returns true if blocks can be added make the sculpture balanced, with no empty columns in the middle", () => {
		assert.isTrue(PartialSculpture.canBeBalanced(12, 10, 3)); // can be balanced using blocks at x=11, x=-11, and x=12
	});
	it("returns false if blocks cannot be added to make the sculpture balanced", () => {
		assert.isFalse(PartialSculpture.canBeBalanced(100, 10, 3));
		assert.isFalse(PartialSculpture.canBeBalanced(0, 10, 3));
	});
});
