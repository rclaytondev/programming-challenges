import { describe } from "mocha";
import { GenUtils } from "../../../utils-ts/modules/core-extensions/GenUtils.mjs";
import { Problem563 } from "./robot-welders.mjs";
import { assert } from "chai";

describe("Problem563.factorizationsWithPrimes", () => {
	it("can yield all numbers whose factorization have only the given primes, in increasing order", () => {
		const factorizations = [...GenUtils.slice(Problem563.factorizationsWithPrimes([2, 3]), 0, 10)];
		const numbers = factorizations.map(f => f.toNumber());
		assert.sameOrderedMembers(numbers, [
			1, 2, 3, 4, 6, 8, 9, 12, 16, 18,
		]);
	});
});
