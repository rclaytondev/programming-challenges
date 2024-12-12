import { assert } from "chai";
import { describe } from "mocha";
import { TauNumbers } from "./tau-numbers.mjs";

describe("TauNumbers.minTauNumber", () => {
	it("returns 24 when given 8", () => {
		assert.equal(TauNumbers.minTauNumber(8, 1000), 24);
	});
	it("returns 60 when given 12", () => {
		assert.equal(TauNumbers.minTauNumber(12, 1000), 60);
	});
	it("returns 384 when given 16", () => {
		assert.equal(TauNumbers.minTauNumber(16, 1000), 384);
	});
});

describe("TauNumbers.tauSum", () => {
	it("returns 3189 for an input of 1000", () => {
		assert.equal(TauNumbers.tauSum(1000), 3189);
	});
});
