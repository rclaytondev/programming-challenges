import { describe } from "mocha";
import { fullConnectedGraphs, graphsWithComponents } from "./power-sets.mjs";
import { assert } from "chai";

describe("graphsWithComponents", () => {
	it("can find the number of sets of subsets of {1} whose graph has 2 components", () => {
		const result = graphsWithComponents(1, 2);
		assert.equal(result, 0);
	});
	it("can find the number of sets of subsets of {1} whose graph has 1 component", () => {
		const result = graphsWithComponents(1, 1);
		assert.equal(result, 1);
	});
	it("can find the number of sets of subsets of {1, 2} whose graph has 2 components", () => {
		const result = graphsWithComponents(2, 2);
		assert.equal(result, 1);
	});

	it("can find the number of sets of subsets of {1, 2} whose graph has 1 component", () => {
		/* test case from Project Euler */
		const result = graphsWithComponents(2, 1);
		assert.equal(result, 6);
	});
	it("can find the number of sets of subsets of {1, 2, 3} whose graph has 2 components", () => {
		const result = graphsWithComponents(3, 2);
		assert.equal(result, 15);
	});
	it("can find the number of sets of subsets of {1, 2, 3} whose graph has 1 component", () => {
		/* test case from Project Euler */
		const result = graphsWithComponents(3, 1);
		assert.equal(result, 111);
	});
	it("can find the number of sets of subsets of {1, 2, 3, 4} whose graph has 2 components", () => {
		/* test case from Project Euler */
		const result = graphsWithComponents(4, 2);
		assert.equal(result, 486);
	});
});
describe("fullConnectedGraphs", () => {
	it("works for n=1", () => {
		const result = fullConnectedGraphs(1);
		assert.equal(result, 1);
	});
	it("works for n=2", () => {
		const result = fullConnectedGraphs(2);
		assert.equal(result, 4);
	});
});
