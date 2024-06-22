import { assert } from "chai";
import { Sequence } from "../../utils-ts/modules/math/Sequence.mjs";
import { describe, it } from "mocha";
import { MathUtils } from "../../utils-ts/modules/math/MathUtils.mjs";

const getSets = function*(setSize: number, sum: number, partialSet: number[] = []): Generator<number[]> {
	if(partialSet.length === setSize) {
		yield partialSet;
	}
	else {
		outerLoop: for(const nextTerm of Sequence.PRIMES.termsBetween(
			partialSet[partialSet.length - 1] ?? 0,
			(sum - MathUtils.sum(partialSet)) / (setSize - partialSet.length),
			"exclusive", "inclusive"
		)) {
			for(const previousTerm of partialSet) {
				if(!MathUtils.isPrime(Number.parseInt(`${previousTerm}${nextTerm}`)) || !MathUtils.isPrime(Number.parseInt(`${nextTerm}${previousTerm}`))) {
					continue outerLoop;
				}
			}
			yield* getSets(setSize, sum, [...partialSet, nextTerm]);
		}
	}
};
const solve = (setSize: number = 5) => {
	for(let sum = 2 + 3 + 5 + 7 + 11; sum < Infinity; sum ++) {
		let foundSet = false;
		for(const set of getSets(setSize, sum)) {
			foundSet = true;
			break;
		}
		if(foundSet) {
			return sum;
		}
	}
	throw new Error("Unexpected: reached end of infinite loop.");
};
describe("solve", () => {
	// it("solves the test case from Project Euler", () => {
	// 	assert.equal(solve(4), 792);
	// });
});
