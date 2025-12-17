import { assert } from "chai";
import { MathUtils } from "../../utils-ts/modules/math/MathUtils.mjs";
import { CountLogger } from "../project-specific-utilities/CountLogger.mjs";
import { BigintMath } from "../../utils-ts/modules/math/BigintMath.mjs";

const sumOfElevisors = (upperBound: number, modulo: number) => {
	const logger = new CountLogger(n => n ** 4 * 10000, upperBound);
	let sum = Number((
		BigInt(MathUtils.modularExponentiate(2, upperBound - 1, modulo))
		 * (BigintMath.rangeSum(1n, BigInt(upperBound)) % BigInt(modulo))
	) % BigInt(modulo));
	let quotient = 1;
	while(quotient <= upperBound) {
		logger.countTo(quotient);
		const smallestWithQuotient = Math.floor(upperBound / (quotient + 1)) + 1;
		const largestWithQuotient = Math.floor(upperBound / quotient);
		const rangeSum = MathUtils.rangeSum(smallestWithQuotient, largestWithQuotient) % modulo;
		const power = MathUtils.modularExponentiate(2, upperBound - quotient, modulo);
		sum -= Number((BigInt(rangeSum) * BigInt(power)) % BigInt(modulo));
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

console.time();
console.log(sumOfElevisors(10 ** 14, 1234567891));
console.timeEnd();
debugger;
