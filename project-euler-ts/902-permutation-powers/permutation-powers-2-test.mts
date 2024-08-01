import { describe, it } from "mocha";
import { Permutation } from "./permutation-powers.mjs";
import { productCycles, solve } from "./permutation-powers-2.mjs";
import { assert } from "chai";

describe("productCycles", () => {
	it("yields all the cycles of the permutation (x, y) -> (p(x), p(y)) where p is the given permutation", () => {
		const permutation = new Permutation([2, 1, 4, 3]); // cycles: [1, 2], [3, 4]
		const cycles = [...productCycles(permutation)];
		assert.sameDeepMembers(cycles, [
			[ [1, 1], [2, 2] ],
			[ [1, 2], [2, 1] ],
			
			[ [1, 3], [2, 4] ],
			[ [1, 4], [2, 3] ],
			[ [3, 1], [4, 2] ],
			[ [3, 2], [4, 1] ],
			
			[ [3, 3], [4, 4] ],
			[ [3, 4], [4, 3] ]
		]);
	});
	it("works when the cycles have different lengths", () => {
		const permutation = new Permutation([2, 1, 4, 5, 3]); // cycles: [1, 2], [3, 4, 5]
		const cycles = [...productCycles(permutation)];
		assert.sameDeepMembers(cycles, [
			[ [1, 1], [2, 2] ],
			[ [1, 2], [2, 1] ],
			
			[ [1, 3], [2, 4], [1, 5], [2, 3], [1, 4], [2, 5] ],
			[ [3, 1], [4, 2], [5, 1], [3, 2], [4, 1], [5, 2] ],

			[ [3, 3], [4, 4], [5, 5] ],
			[ [3, 4], [4, 5], [5, 3] ],
			[ [3, 5], [4, 3], [5, 4] ]
		]);
	});
});
describe("solve", () => {
	it("works for 2", () => {
		const result = solve(2, 10n ** 9n + 7n);
		assert.equal(result, 4n);
	});
	it("works for 3", () => {
		const result = solve(3, 10n ** 9n + 7n);
		assert.equal(result, 780n);
	});
	it("works for 4", () => {
		const result = solve(4, 10n ** 9n + 7n);
		assert.equal(result, 38810300n);
	});
});
