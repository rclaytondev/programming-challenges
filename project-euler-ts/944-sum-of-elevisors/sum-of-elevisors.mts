import { assert } from "chai";
import { MathUtils } from "../../utils-ts/modules/math/MathUtils.mjs";

const sumOfElevisors = (upperBound: number) => {
	let sum = 0;
	for(let i = 1; i <= upperBound; i ++) {
		sum += i * (2 ** (Math.floor(upperBound / i) - 1) - 1) * 2 ** (upperBound - Math.floor(upperBound / i));
	}
	return sum;
};

describe("sumOfElevisors", () => {
	it("works for an input of 10", () => {
		const result = sumOfElevisors(10);
		assert.equal(result, 4927);
	});
});
