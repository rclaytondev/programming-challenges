import { assert } from "chai";
import { binaryCRT, DiophantineEquation } from "./diophantine-solver.mjs";
import { describe, it } from "mocha";

describe("DiophantineEquation.solutions", () => {
	it("can generate Pythagorean triples", () => {
		const equation = new DiophantineEquation(
			3,
			(a, b, c) => a ** 2n + b ** 2n,
			(a, b, c) => c ** 2n
		);
		let iterations = 0;
		for(const solution of equation.solutions()) {
			const [a, b, c] = solution;
			assert.equal(a ** 2n + b ** 2n, c ** 2n);
			iterations ++;
			if(iterations >= 5) { break; }
		}
		assert.isAtLeast(iterations, 5);
	});
});
describe("binaryCRT", () => {
	it("can return a number that is congruent to 2 modulo 5 and 3 modulo 7", () => {
		const result = binaryCRT(5n, 2n, 7n, 3n);
		assert.equal(result % 5n, 2n);
		assert.equal(result % 7n, 3n);
	});
});
