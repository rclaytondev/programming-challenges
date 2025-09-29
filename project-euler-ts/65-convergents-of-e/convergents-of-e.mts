import { describe } from "mocha";
import { BigRational } from "../../utils-ts/modules/math/BigRational.mjs";
import { assert } from "chai";
import { BigintMath } from "../../utils-ts/modules/math/BigintMath.mjs";
import { MathUtils } from "../../utils-ts/modules/math/MathUtils.mjs";

const getConvergent = (index: number, partialNumerators: (n: number) => number) => {
	let result = new BigRational(partialNumerators(index));
	for(let n = index - 1; n >= 1; n --) {
		result = result.inverse().add(new BigRational(partialNumerators(n)));
	}
	return result;
};

describe("getConvergent", () => {
	it("works for sqrt(2)", () => {
		const result = getConvergent(5, n => (n === 1) ? 1 : 2);
		assert.equal(`${result}`, "41/29");
	});
});

const bigintDigits = (num: bigint) => {
	return [...num.toString()].map(c => Number.parseInt(c));
}

const solve = () => {
	const partialNumerators = (n: number) => {
		if(n === 1) { return 2; }
		if(n % 3 === 0) {
			return 2 * (n / 3);
		}
		return 1;
	};
	return MathUtils.sum(bigintDigits(getConvergent(100, partialNumerators).numerator));
};
console.time();
console.log(solve());
console.timeEnd();
debugger;
