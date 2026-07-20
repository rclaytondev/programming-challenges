import { describe, it } from "mocha";
import { Problem780 } from "./toriangulations.mjs";
import { assert } from "chai";

describe("Problem780.numToriangulations", () => {
	it("can compute the number of toriangulations with at most 4 triangles", () => {
		const toriangulations = Problem780.toriangulations(4, "upper-bound");
		assert.equal(toriangulations.length, 6);
	});
	it("can compute the number of toriangulations with 6 triangles", () => {
		const toriangulations = Problem780.toriangulations(6, "exact");
		assert.equal(toriangulations.length, 8);
	});
	
	// it("can compute the number of toriangulations with at most 100 triangles", () => {
	// 	const toriangulations = Problem780.toriangulations(100, "upper-bound");
	// 	assert.equal(toriangulations.length, 8090);
	// });
});
