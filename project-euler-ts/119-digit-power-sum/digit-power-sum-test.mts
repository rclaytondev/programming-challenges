import { describe } from "mocha";
import { powers, solutionSequence } from "./digit-power-sum.mjs";
import { assert } from "chai";

describe("powers", () => {
	it("can yield all the nontrivial perfect powers in increasing order without duplicates", () => {
		const result = [];
		for(const value of powers()) {
			if(result.length < 10) {
				result.push(value);
			}
			else { break; }
		}
		assert.deepEqual(result, [4, 8, 9, 16, 25, 27, 32, 36, 49, 64]);
	});
});
describe("solutionSequence", () => {
	it("can calculate the second term", () => {
		const result = solutionSequence.getTerm(1);
		assert.equal(result, 512);
	});
	it("can calculate the tenth term", () => {
		const result = solutionSequence.getTerm(9);
		assert.equal(result, 614656);
	});
});
