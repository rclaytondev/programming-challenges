import { assert } from "chai";
import { MathUtils } from "../../utils-ts/modules/math/MathUtils.mjs";

const sumOfElevisors = (upperBound: number) => {
	let sum = 2 ** (upperBound - 1) * MathUtils.rangeSum(1, upperBound);
	for(let quotient = 1; quotient <= upperBound; ) {
		const smallestWithQuotient = Math.floor(upperBound / (quotient + 1)) + 1;
		const largestWithQuotient = Math.floor(upperBound / quotient);
		sum -= MathUtils.rangeSum(smallestWithQuotient, largestWithQuotient) * 2 ** (upperBound - quotient);
		quotient = Math.floor(upperBound / (smallestWithQuotient - 1));
	}
	return sum;
};

describe("sumOfElevisors", () => {
	it("works for an input of 10", () => {
		const result = sumOfElevisors(10);
		assert.equal(result, 4927);
	});
});
