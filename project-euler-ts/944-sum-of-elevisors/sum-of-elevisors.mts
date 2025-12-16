import { assert } from "chai";
import { MathUtils } from "../../utils-ts/modules/math/MathUtils.mjs";

const sumOfElevisors = (upperBound: number) => {
	let quotient = upperBound;
	let minWithQuotient = 1;
	let maxWithQuotient = 1;
	let sum = 2 ** (upperBound - 1) * MathUtils.rangeSum(1, upperBound);
	while(maxWithQuotient <= upperBound) {
		sum -= 2 ** (upperBound - quotient) ** MathUtils.rangeSum(minWithQuotient, maxWithQuotient);
		const nextQuotient = Math.floor(upperBound / (maxWithQuotient + 1));
		[quotient, minWithQuotient, maxWithQuotient] = [
			nextQuotient,
			maxWithQuotient + 1,
			Math.floor(upperBound / nextQuotient)
		];
	}
	return sum;
};

describe("sumOfElevisors", () => {
	it("works for an input of 10", () => {
		const result = sumOfElevisors(10);
		assert.equal(result, 4927);
	});
});
