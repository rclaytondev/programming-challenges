import { assert } from "chai";
import { idempotents } from "./idempotent-matrices.mjs";
import { describe, it } from "mocha";

describe("idempotents", () => {
	it("returns the correct answer for -1 <= (entries) <= 1", () => {
		const result = idempotents(1);
		assert.equal(result, 164);
	});
	it("returns the correct answer for -2 <= (entries) <= 2", () => {
		const result = idempotents(2);
		assert.equal(result, 848);
	});
});
