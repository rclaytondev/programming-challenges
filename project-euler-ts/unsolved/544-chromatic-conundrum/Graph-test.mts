import { describe } from "mocha";
import { Graph } from "./Graph.mjs";
import { assert } from "chai";
import { SetUtils } from "../../../utils-ts/modules/core-extensions/SetUtils.mjs";
import { ArrayUtils } from "../../../utils-ts/modules/core-extensions/ArrayUtils.mjs";

describe("Graph.edges", () => {
	it("yields all the edges in the graph, not including duplicates obtained by swapping the two vertices", () => {
		const graph = Graph.fromEdgesList(
			[1, 2, 3, 4, 5],
			[
				[1, 2],
				[2, 3],
				[4, 4],
			],
		);
		const edges = [...graph.edges()];
		assert.equal(edges.length, 3);
		assert.isTrue(edges.some(e => SetUtils.equals(e, [1, 2])));
		assert.isTrue(edges.some(e => SetUtils.equals(e, [2, 3])));
		assert.isTrue(edges.some(e => ArrayUtils.equals(e, [4, 4])));
	});
});
