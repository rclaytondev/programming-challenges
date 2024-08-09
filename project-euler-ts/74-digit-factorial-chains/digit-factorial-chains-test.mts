import { assert } from "chai";
import { describe, it } from "mocha";
import { isChainLength } from "./digit-factorial-chains.mjs";

describe("isChainLength", () => {
	it("returns true when the sequence before the repetitions has the given length", () => {
		assert.isTrue(isChainLength(69, 5));
	});
	it("returns false when the sequence has a shorter length", () => {
		assert.isFalse(isChainLength(69, 4));
	});
	it("returns false when the sequence has a longer length", () => {
		assert.isFalse(isChainLength(69, 6));
	});
	it("works when the chain has length 1 (i.e. it is a fixed point)", () => {
		assert.isTrue(isChainLength(145, 1));
	});
});
