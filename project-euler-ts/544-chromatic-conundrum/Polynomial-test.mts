import { describe } from "mocha";
import { Polynomial } from "./Polynomial.mjs";
import { assert } from "chai";

describe("Polynomial.sum", () => {
	it("can compute the sum of polynomials by adding the coefficients on each power of x", () => {
		const polynomials = [
			new Polynomial([1, 2, 3, 0, 0, 0]),
			new Polynomial([4, 5, 6, 7]),
			new Polynomial([8, 9, 10, -7])
		];
		const result = Polynomial.sum(polynomials);
		assert.sameOrderedMembers(result.coefficients, [1+4+8, 2+5+9, 3+6+10]);
	});
});
