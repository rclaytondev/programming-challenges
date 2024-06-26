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
