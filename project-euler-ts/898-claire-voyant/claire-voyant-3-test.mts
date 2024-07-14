import { describe, it } from "mocha";
import { BigRational } from "../../utils-ts/modules/math/BigRational.mjs";
import { DiscreteDistribution, getProductDistribution, solve } from "./claire-voyant-3.mjs";
import { assert } from "chai";

describe("getProductDistribution", () => {
	it("computes the distribution of the product of the random variables with the given distributions", () => {
		const dist1 = new DiscreteDistribution(new Map([
			[new BigRational(1), new BigRational(1, 4)],
			[new BigRational(2), new BigRational(1, 2)],
			[new BigRational(3), new BigRational(1, 4)]
		]));
		const dist2 = new DiscreteDistribution(new Map([
			[new BigRational(1), new BigRational(1, 6)],
			[new BigRational(2), new BigRational(5, 6)],
		]));
		const [result] = getProductDistribution(dist1, dist2);
		assert.deepEqual(result, new DiscreteDistribution(new Map([
			[new BigRational(1), new BigRational(1, 24)],
			[new BigRational(2), new BigRational(7, 24)], // 1/4 * 5/6 + 1/2 * 1/6
			[new BigRational(3), new BigRational(1, 24)],
			[new BigRational(4), new BigRational(5, 12)],
			[new BigRational(6), new BigRational(5, 24)],
		])));
	});
});
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
