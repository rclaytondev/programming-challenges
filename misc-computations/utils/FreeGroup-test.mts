import { describe, it } from "mocha";
import { FreeGroup } from "./FreeGroup.mjs";
import { assert } from "chai";

describe("FreeGroup.multiply", () => {
	it("concatenates words and then repeatedly remove adjacent inverse pairs until there are none left", () => {
		const word1 = [
			{ generator: "a", inverted: false },
			{ generator: "b", inverted: true },
			{ generator: "c", inverted: false }
		];
		const word2 = [
			{ generator: "c", inverted: true },
			{ generator: "b", inverted: false },
			{ generator: "d", inverted: true }
		];
		const result = new FreeGroup(["a", "b", "c", "d"]).multiply(word1, word2);
		assert.deepEqual(result, [
			{ generator: "a", inverted: false },
			{ generator: "d", inverted: true }
		]);
	});
});
