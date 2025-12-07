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
// describe("rank1Idempotents", () => {
// 	it("gives the correct answer for -1 <= (entries) <= 1", () => {
// 		const result = rank1Idempotents(1);
// 		assert.equal(result, 87);
// 	});
// 	it("gives the correct answer for -2 <= (entries) <= 2", () => {
// 		const result = rank1Idempotents(2);
// 		assert.equal(result, 447);
// 	});
// });
// describe("rank2Idempotents", () => {
// 	it("gives the correct answer for -1 <= (entries) <= 1", () => {
// 		const result = rank2Idempotents(1);
// 		assert.equal(result, 75);
// 	});
// 	it("gives the correct answer for -2 <= (entries) <= 2", () => {
// 		const result = rank2Idempotents(2);
// 		assert.equal(result, 399);
// 	});
// });
