import { describe, it } from "mocha";
import { primeSubsetSums } from "./prime-subset-sums-2.mjs";
import { assert } from "chai";

describe("primeSubsetSums", () => {
	it("can compute the number of sets of primes less than 10 with a prime sum", () => {
		const result = primeSubsetSums(10);
		assert.equal(result, 7);
		/*
		4 singletons: {2}, {3}, {5}, {7}
		2 pairs: {2, 3}, {2, 5}, but not {2, 7} and all others have an even sum
		0 triples: anything with a 2 has an even sum, and {3, 5, 7} doesn't work
		1 quadruple: {2, 3, 5, 7}
		*/
	});
	it("can compute the number of sets of primes less than 30 with a prime sum", () => {
		const result = primeSubsetSums(30);
		assert.equal(result, 237); // computed using the naive algorithm
	});
});
