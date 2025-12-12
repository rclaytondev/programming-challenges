import { describe } from "mocha";
import { getSqrtsOf1, naiveSqrtsOf1 } from "./modular-inverses.mjs";
import { assert } from "chai";
import { PeriodicSet } from "../project-specific-utilities/PeriodicSet.mjs";

describe("getSqrtsOf1", () => {
	it("can compute modular square roots of 1, and agrees with the naive algorithm on small test cases", () => {
		const expected = naiveSqrtsOf1(20);
		const actual = getSqrtsOf1(20);
		for(let i = 2; i <= 20; i ++) {
			assert.deepEqual(
				actual[i], expected.get(i)!,
				`For n=${i}, expected ${expected.get(i)!} but got ${actual[i]})`
			);
		}
	});
});
