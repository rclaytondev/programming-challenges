import { assert } from "chai";
import { describe, it } from "mocha";
import { solve } from "./claire-voyant-4.mjs";
import { BigRational } from "../../utils-ts/modules/math/BigRational.mjs";

describe("solve", () => {
	it("works for the input [0.3]", () => {
		const result = solve([new BigRational(30, 100)]);
		assert.deepEqual(result, new BigRational(70, 100));
	});
	it("works for the input [0.2, 0.4]", () => {
		const inputs = [new BigRational(20, 100), new BigRational(40, 100)];
		const result = solve(inputs);
		assert.deepEqual(result, new BigRational(80, 100));
	});
	it("works for the input [0.2, 0.4, 0.6, 0.8]", () => {
		const inputs = [
			new BigRational(20, 100),
			new BigRational(40, 100),
			new BigRational(60, 100),
			new BigRational(80, 100),
		];
		const result = solve(inputs);
		assert.deepEqual(result, new BigRational(832, 1000));
	});
});
