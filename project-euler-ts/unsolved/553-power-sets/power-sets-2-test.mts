import { describe } from "mocha";
import { assert } from "chai";
import { fullConnectedGraphs, graphsWithComponents } from "./power-sets-2.mjs";

describe("graphsWithComponents", () => {
	it("can find the number of sets of subsets of {1} whose graph has 2 components", () => {
		const result = graphsWithComponents(1n, 2n, 1000n);
		assert.equal(result, 0n);
	});
	it("can find the number of sets of subsets of {1} whose graph has 1 component", () => {
		const result = graphsWithComponents(1n, 1n, 1000n);
		assert.equal(result, 1n);
	});
	it("can find the number of sets of subsets of {1, 2} whose graph has 2 components", () => {
		const result = graphsWithComponents(2n, 2n, 1000n);
		assert.equal(result, 1n);
	});

	it("can find the number of sets of subsets of {1, 2} whose graph has 1 component", () => {
		/* test case from Project Euler */
		const result = graphsWithComponents(2n, 1n, 1000n);
		assert.equal(result, 6n);
	});
	it("can find the number of sets of subsets of {1, 2, 3} whose graph has 2 components", () => {
		const result = graphsWithComponents(3n, 2n, 1000n);
		assert.equal(result, 15n);
	});
	it("can find the number of sets of subsets of {1, 2, 3} whose graph has 1 component", () => {
		/* test case from Project Euler */
		const result = graphsWithComponents(3n, 1n, 1000n);
		assert.equal(result, 111n);
	});
	it("can find the number of sets of subsets of {1, 2, 3, 4} whose graph has 2 components", () => {
		/* test case from Project Euler */
		const result = graphsWithComponents(4n, 2n, 1000n);
		assert.equal(result, 486n);
	});
});
describe("fullConnectedGraphs", () => {
	it("works for n=1", () => {
		const result = fullConnectedGraphs(1n, 1000n);
		assert.equal(result, 1n);
	});
	it("works for n=2", () => {
		const result = fullConnectedGraphs(2n, 1000n);
		assert.equal(result, 4n);
	});
});
