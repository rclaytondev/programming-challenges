import { assert } from "chai";
import { describe, it } from "mocha";
import { getChainEnd } from "./square-digit-chains.mjs";

describe("getChainEnd", () => {
	it("returns the number (1 or 89) that is reached after iterating the sum-of-squares-of-digits function", () => {
		assert.equal(getChainEnd(44), 1);
		assert.equal(getChainEnd(85), 89);
	});
});;
