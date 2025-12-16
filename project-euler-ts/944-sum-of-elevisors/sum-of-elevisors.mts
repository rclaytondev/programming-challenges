import { assert } from "chai";
import { MathUtils } from "../../utils-ts/modules/math/MathUtils.mjs";

const sumOfElevisors = (upperBound: number, modulo: number) => {
	let sum = MathUtils.modularExponentiate(2, upperBound - 1, modulo) * (MathUtils.rangeSum(1, upperBound) % modulo) % modulo;
	let quotient = 1;
	while(quotient <= upperBound) {
		const smallestWithQuotient = Math.floor(upperBound / (quotient + 1)) + 1;
		const largestWithQuotient = Math.floor(upperBound / quotient);
		const rangeSum = MathUtils.rangeSum(smallestWithQuotient, largestWithQuotient) % modulo;
		const power = MathUtils.modularExponentiate(2, upperBound - quotient, modulo);
		sum -= (rangeSum * power) % modulo;
		quotient = Math.floor(upperBound / (smallestWithQuotient - 1));
	}
	return MathUtils.generalizedModulo(sum, modulo);
};

describe("sumOfElevisors", () => {
	it("works for an input of 10", () => {
		const result = sumOfElevisors(10, 10000);
		assert.equal(result, 4927);
	});
});
