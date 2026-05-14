import { describe } from "mocha";
import { HashGraph } from "./HashGraph.mjs";
import { chromaticPolynomial, monomialSum, naiveMonomialSum } from "./chromatic-conundrum.mjs";
import { assert } from "chai";

describe("chromaticPolynomial", () => {
	it("can compute the chromatic polynomial of the line graph on 2 vertices", () => {
		const lineGraph = HashGraph.fromEdgesList(
			[1, 2],
			[[1, 2]]
		);
		const polynomial = chromaticPolynomial(lineGraph);
		assert.sameOrderedMembers(polynomial.coefficients, [0, -1, 1]);
	});
	it("can compute the chromatic polynomial of the line graph on 3 vertices", () => {
		const lineGraph = HashGraph.fromEdgesList(
			[1, 2, 3],
			[[1, 2], [2, 3]]
		);
		const polynomial = chromaticPolynomial(lineGraph);
		assert.sameOrderedMembers(polynomial.coefficients, [0, 1, -2, 1]);
	});
});

// describe("monomialSum", () => {
// 	it("works for an exponent of 1", () => {
// 		const result = monomialSum(1, 10);
// 		const expected = naiveMonomialSum(1, 10);
// 		assert.equal(result, expected);
// 	});
// 	it("works for an exponent of 2", () => {
// 		const result = monomialSum(2, 10);
// 		const expected = naiveMonomialSum(2, 10);
// 		assert.equal(result, expected);
// 	});
// 	it("works for an exponent of 3", () => {
// 		const result = monomialSum(3, 10);
// 		const expected = naiveMonomialSum(3, 10);
// 		assert.equal(result, expected);
// 	});
// });
