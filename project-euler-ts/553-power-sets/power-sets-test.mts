import { describe, it } from "mocha";
import { connectedGraphs, maxUnionSubsets, subsetsWithElements } from "./power-sets.mjs";
import { HashSet } from "../../utils-ts/modules/HashSet.mjs";
import { assert } from "chai";

describe("maxUnionSubsets", () => {
	it("returns the number of sets of sets whose union is {1, 2, ... n}", () => {
		const result = maxUnionSubsets(3);
		result.assertCorrectLength();
	});
});
describe("maxUnionSubsets", () => {
	it("returns the number of sets of sets whose union contains at least one element from each of the given disjoint set", () => {
		const result = subsetsWithElements(3, new Set([new Set([1]), new Set([2, 3])]));
	});
});

describe("connectedGraphs", () => {
	it.only("works for n=1", () => {
		const connected = new HashSet(connectedGraphs(1));

		const empty = new HashSet<number>();
		const setWith1 = new HashSet([1]);
		const expected = new HashSet([
			new HashSet<HashSet<number>>([]),
			new HashSet([empty]),
			new HashSet([setWith1]),
		]);

		assert.isTrue(connected.equals(expected));
	});
	it("works for n=2", () => {
		const connected = new HashSet(connectedGraphs(2));

		const empty = new HashSet<number>();
		const setWith1 = new HashSet([1]);
		const setWith2 = new HashSet([2]);
		const both = new HashSet([1, 2]);

		const expected = new HashSet([
			new HashSet<HashSet<number>>([]),
			new HashSet([empty]),
			new HashSet([setWith1]),
			new HashSet([setWith1, both]),
			new HashSet([setWith1, both, setWith2]),
			new HashSet([both]),
			new HashSet([both, setWith2]),
			new HashSet([setWith2]),
		]);

		assert.isTrue(connected.equals(expected));
	});
});
