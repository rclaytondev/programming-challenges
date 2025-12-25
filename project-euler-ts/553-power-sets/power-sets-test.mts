import { describe } from "mocha";
import { graphsWithComponents } from "./power-sets.mjs";
import { assert } from "chai";

describe("graphsWithComponents", () => {
	it("can find the number of subsets of {1, 2} whose graph has 1 component", () => {
		const result = graphsWithComponents(2, 1);
		assert.equal(result, 6);
	});
	it("can find the number of subsets of {1, 2, 3} whose graph has 1 component", () => {
		const result = graphsWithComponents(3, 1);
		assert.equal(result, 111);
	});
	it("can find the number of subsets of {1, 2, 3, 4} whose graph has 2 components", () => {
		const result = graphsWithComponents(4, 2);
		assert.equal(result, 486);
	});
});
