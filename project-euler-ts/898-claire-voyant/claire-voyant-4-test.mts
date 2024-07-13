import { assert } from "chai";
import { describe, it } from "mocha";
import { naiveWeightedSum, solve, weightedSum } from "./claire-voyant-4.mjs";
import { BigRational } from "../../utils-ts/modules/math/BigRational.mjs";
import { DiscreteDistribution } from "./claire-voyant-4.mjs";

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
describe("weightedSum", () => {
	it("works for a simple test case with 1 state and 1 ray", () => {
		const stateDistribution = new DiscreteDistribution(new Map([
			[new BigRational(3), new BigRational(1, 4)]
		]));
		const rayDistribution = new DiscreteDistribution(new Map([
			[new BigRational(2), new BigRational(1, 5)]
		]));
		const pointDistribution = rayDistribution;
		const expected = naiveWeightedSum(stateDistribution, pointDistribution, rayDistribution);
		const actual = weightedSum(stateDistribution, pointDistribution, rayDistribution);
		assert.deepEqual(actual, expected);
	});
});
