import { describe, it } from "mocha";
import { Rational } from "../../utils-ts/modules/math/Rational.mjs";
import { DiscreteDistribution, getProductDistribution, solve } from "./claire-voyant-3.mjs";
import { assert } from "chai";

describe("getProductDistribution", () => {
	it("computes the distribution of the product of the random variables with the given distributions", () => {
		const dist1 = new DiscreteDistribution(new Map([
			[new Rational(1), new Rational(1, 4)],
			[new Rational(2), new Rational(1, 2)],
			[new Rational(3), new Rational(1, 4)]
		]));
		const dist2 = new DiscreteDistribution(new Map([
			[new Rational(1), new Rational(1, 6)],
			[new Rational(2), new Rational(5, 6)],
		]));
		const [result] = getProductDistribution(dist1, dist2);
		assert.deepEqual(result, new DiscreteDistribution(new Map([
			[new Rational(1), new Rational(1, 24)],
			[new Rational(2), new Rational(7, 24)], // 1/4 * 5/6 + 1/2 * 1/6
			[new Rational(3), new Rational(1, 24)],
			[new Rational(4), new Rational(5, 12)],
			[new Rational(6), new Rational(5, 24)],
		])));
	});
});
describe("solve", () => {
	it("works for the input [0.3]", () => {
		const result = solve([new Rational(30, 100)]);
		assert.deepEqual(result, new Rational(70, 100));
	});
	it("works for the input [0.2, 0.4]", () => {
		const inputs = [new Rational(20, 100), new Rational(40, 100)];
		const result = solve(inputs);
		assert.deepEqual(result, new Rational(80, 100));
	});
	it("works for the input [0.2, 0.4, 0.6, 0.8]", () => {
		const inputs = [
			new Rational(20, 100),
			new Rational(40, 100),
			new Rational(60, 100),
			new Rational(80, 100),
		];
		const result = solve(inputs);
		assert.deepEqual(result, new Rational(832, 1000));
	});
});
