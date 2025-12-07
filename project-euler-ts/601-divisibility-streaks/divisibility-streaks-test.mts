import { describe, it } from "mocha";
import { numWithStreaks } from "./divisibility-streaks.mjs";
import { assert } from "chai";

describe("numWithStreaks", () => {
	it("works for the first example from Project Euler", () => {
		const result = numWithStreaks(3, 14);
		assert.equal(result, 1);
	});
	it("works for the second example from Project Euler", () => {
		const result = numWithStreaks(6, 10 ** 6);
		assert.equal(result, 14286);
	});
});
