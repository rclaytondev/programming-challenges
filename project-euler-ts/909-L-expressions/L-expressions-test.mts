import { describe } from "mocha";
import { evaluate, LExpression } from "./L-expressions.mjs";
import { assert } from "chai";

describe("evaluate", () => {
	it("works for the first example from Project Euler", () => {
		const expression: LExpression = ["S", "Z", "A", 0];
		const result = evaluate(expression);
		assert.equal(result, 1);
	});
});
