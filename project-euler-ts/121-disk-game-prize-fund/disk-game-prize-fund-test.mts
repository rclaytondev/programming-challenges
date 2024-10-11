import { describe } from "mocha";
import { winProbability } from "./disk-game-prize-fund.mjs";
import { assert } from "chai";
import { BigRational } from "../../utils-ts/modules/math/BigRational.mjs";

describe("winProbability", () => {
	it("works for the example from Project Euler", () => {
		const result = winProbability(0, 0, 4);
		assert.deepEqual(result, new BigRational(11, 120));
	});
	it("works for the game with 2 rounds", () => {
		const result = winProbability(0, 0, 2);
		assert.deepEqual(result, new BigRational(1, 6));
	});
});
