import { assert } from "chai";
import { BigintMath } from "../../utils-ts/modules/math/BigintMath.mjs";

const sumOfElevisors = (upperBound: bigint, modulo: bigint) => {
	const firstTerm = (
		BigintMath.modularExponentiate(2n, upperBound - 1n, modulo)
		 * (BigintMath.rangeSum(1n, upperBound) % modulo)
	) % modulo;
	let sum = 0n;
	let quotient = 1n;
	while(quotient <= upperBound) {
		const smallestWithQuotient = upperBound / (quotient + 1n) + 1n;
		const largestWithQuotient = upperBound / quotient;
		const rangeSum = BigintMath.rangeSum(smallestWithQuotient, largestWithQuotient) % modulo;
		const power = BigintMath.modularExponentiate(2n, upperBound - quotient, modulo);
		sum += (rangeSum * power) % modulo;
		sum %= modulo;
		if(smallestWithQuotient === 1n) { break; }
		quotient = upperBound / (smallestWithQuotient - 1n);
	}
	return BigintMath.generalizedModulo(firstTerm - sum, modulo);
};

describe("sumOfElevisors", () => {
	it("works for an input of 10", () => {
		const result = sumOfElevisors(10n, 10000n);
		assert.equal(result, 4927n);
	});
});

// console.time();
// console.log(sumOfElevisors(10n ** 14n, 1234567891n));
// console.timeEnd();
// debugger;
