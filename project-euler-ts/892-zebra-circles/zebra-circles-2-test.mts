import { assert } from "chai";
import { describe } from "mocha";
import { Tree } from "./zebra-circles-2.mjs";
import { Sequence } from "../../utils-ts/modules/math/Sequence.mjs";

describe("Tree.treesUpToReordering", () => {
	it("can find all the trees with 2 vertices, up to reordering the children", () => {
		const trees = [...Tree.treesUpToReordering(2)];
		const expected = [
			Tree.line(2)
		];
		assert.sameDeepMembers(trees, expected);
	});
	it("can find all the trees with 3 vertices, up to reordering the children", () => {
		const trees = [...Tree.treesUpToReordering(3)];
		const expected = [
			Tree.line(3),
			Tree.star(3)
		];
		assert.sameDeepMembers(trees, expected);
	});
	it("can find all the trees with 4 vertices, up to reordering the children", () => {
		const trees = [...Tree.treesUpToReordering(4)];
		const expected = [
			Tree.line(4),
			new Tree([Tree.star(3)]),
			new Tree([Tree.line(1), Tree.line(2)]),
			Tree.star(4)
		];
		assert.sameDeepMembers(trees, expected);
	});
	it("can yield all the trees with 5 vertices, up to reordering the children", () => {
		const trees = [...Tree.treesUpToReordering(5)];
		const expected = [
			Tree.line(5),
			new Tree([new Tree([Tree.star(3)])]),
			new Tree([new Tree([Tree.line(1), Tree.line(2)])]),
			new Tree([Tree.star(4)]),

			new Tree([Tree.line(2), Tree.line(2)]),
			new Tree([Tree.line(1), Tree.line(3)]),
			new Tree([Tree.star(1), Tree.star(3)]),

			new Tree([Tree.line(1), Tree.line(1), Tree.line(2)]),

			Tree.star(5)
		];
		assert.sameDeepMembers(trees, expected);
	});
});
describe("Tree.numRearrangements", () => {
	it("works for a tree with 1 rearrangement", () => {
		const tree = new Tree([Tree.line(2), Tree.line(2)]);
		const numRearrangements = tree.numRearrangements();
		assert.equal(numRearrangements, 1);
	});
	it("works for a tree with 2 rearrangements", () => {
		const tree = new Tree([Tree.line(2), Tree.line(3)]);
		const numRearrangements = tree.numRearrangements();
		assert.equal(numRearrangements, 2);
	});
	it("works for a tree where vertices other than the root can be rearranged", () => {
		const tree = new Tree([
			new Tree([]),
			new Tree([
				Tree.line(1),
				Tree.line(1),
				Tree.line(2),
			])
		]);
		const numRearrangements = tree.numRearrangements();
		assert.equal(numRearrangements, 2 * 3);
	});
	it("works when some of the children are equal", () => {
		const tree = new Tree([
			new Tree([]),
			new Tree([Tree.line(1), Tree.line(2)]),
			new Tree([Tree.line(1), Tree.line(2)])
		]);
		const numRearrangements = tree.numRearrangements();
		assert.equal(numRearrangements, 2 * 2 * 3);
	});
	it("works when some of the children are rearrangements of each other", () => {
		const tree = new Tree([
			new Tree([]),
			new Tree([Tree.line(1), Tree.line(2)]),
			new Tree([Tree.line(2), Tree.line(1)])
		]);
		const numRearrangements = tree.numRearrangements();
		assert.equal(numRearrangements, 2 * 2 * 3);
	});
});
