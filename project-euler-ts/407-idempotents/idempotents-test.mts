import { describe } from "mocha";
import { primesBelow } from "./idempotents.mjs";
import { assert } from "chai";

describe("primesBelow", () => {
	it("can compute the primes from 1 to 11", () => {
		const primes = primesBelow(11);
		assert.sameOrderedMembers(primes, [2, 3, 5, 7, 11]);
	});
});
