import { describe, it } from "mocha";
import { abcHits, abcHitSum } from "./abc-hits.mjs";
import { assert } from "chai";
import { Factorization } from "../../utils-ts/modules/math/Factorization.mjs";

describe("abcHitSum", () => {
	it("can find the sum of c over all abc-hits with c < 1,000 (example from Project Euler)", () => {
		const result = abcHitSum(1000);
		assert.equal(result, 12523);
	});
});

describe("abcHits", () => {
	it("can find the number of abc-hits with a given value of c", () => {
		const result = abcHits(Factorization.fromNumber(5));
		assert.equal(result, 0);
	});
	it("works when some of the abc-hits have a=1", () => {
		const result = abcHits(Factorization.fromNumber(9));
		assert.equal(result, 1);
	});
});
