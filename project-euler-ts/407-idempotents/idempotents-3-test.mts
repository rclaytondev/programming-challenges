import { describe, it } from "mocha";
import { naiveIdempotentSum } from "./naive-algorithm.mjs";
import { allIdempotents, idempotentSum } from "./idempotents-3.mjs";
import { assert } from "chai";

const naiveIdempotents = (modulo: number) => {
	const result = [];
	for(let i = 0; i < modulo; i ++) {
		if(i ** 2 % modulo === i) {
			result.push(i);
		}
	}
	return result;
};

const naiveAllIdempotents = (upperBound: number) => {
	const result = new Map<number, number[]>();
	for(let i = 2; i <= upperBound; i ++) {
		result.set(i, naiveIdempotents(i));
	}
	return result;
};

describe("idempotentSum", () => {
	it("returns the same result as the naive algorithm for 1000", () => {
		const expected = naiveIdempotentSum(1000);
		const actual = idempotentSum(1000);
		assert.equal(actual, expected);
	});
});
describe("allIdempotents", () => {
	it("returns the same result as the naive algorithm for 1000", () => {
		const expected = naiveAllIdempotents(1000);
		const actual = allIdempotents(1000);
		assert.deepEqual(actual, expected);
	});
});
