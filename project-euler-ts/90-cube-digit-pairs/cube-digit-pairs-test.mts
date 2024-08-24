import { describe, it } from "mocha";
import { subsetsOfMaxSize, subsetsOfSize } from "./cube-digit-pairs.mjs";
import { assert } from "chai";

describe("subsetsOfSize", () => {
	it("returns a list of all the subsets of the given set that have the given size", () => {
		const result = subsetsOfSize(["a", "b", "c", "d"], 2);
		assert.sameDeepMembers(result, [
			new Set(["a", "b"]),
			new Set(["a", "c"]),
			new Set(["a", "d"]),
			new Set(["b", "c"]),
			new Set(["b", "d"]),
			new Set(["c", "d"]),
		]);
	});
});
describe("subsetsOfMaxSize", () => {
	it("returns a list of all the subsets of the given set that have size less than or equal to the given size", () => {
		const result = subsetsOfMaxSize(["a", "b", "c", "d"], 2);
		assert.sameDeepMembers(result, [
			new Set([]),
			
			new Set(["a"]),
			new Set(["b"]),
			new Set(["c"]),
			new Set(["d"]),

			new Set(["a", "b"]),
			new Set(["a", "c"]),
			new Set(["a", "d"]),
			new Set(["b", "c"]),
			new Set(["b", "d"]),
			new Set(["c", "d"]),
		]);
	});
});
