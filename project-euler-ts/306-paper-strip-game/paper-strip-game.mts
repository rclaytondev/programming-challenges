import { describe } from "mocha";
import { ArrayUtils } from "../../utils-ts/modules/core-extensions/ArrayUtils.mjs";
import { Utils } from "../../utils-ts/modules/Utils.mjs";
import { minimumExcludant } from "../899-distribunim-I/distribunim-I.mjs";
import { assert } from "chai";

export const grundyValue = Utils.memoize((length: number): number => {
	if(length <= 1) { return 0; }
	const options = ArrayUtils.range(0, length - 2).map(
		n => grundyValue(n) ^ grundyValue(length - 2 - n)
	);
	return minimumExcludant(options);
});

describe("grundyValue", () => {
	it("returns nonzero for the winning position n=2", () => {
		const result = grundyValue(2);
		assert.notEqual(result,	0);
	});
	it("returns nonzero for the winning position n=3", () => {
		const result = grundyValue(3);
		assert.notEqual(result,	0);
	});
	it("returns nonzero for the winning position n=4", () => {
		const result = grundyValue(4);
		assert.notEqual(result,	0);
	});
	it("returns 0 for the losing position n=5", () => {
		const result = grundyValue(5);
		assert.equal(result,	0);
	});
});

const solve = (upperBound: number) => (
	ArrayUtils.range(1, upperBound)
	.filter(n => grundyValue(n) !== 0)
	.length
);

describe("solve", () => {
	it("correctly identifies that there are 40 losing positions for n <= 50", () => {
		const result = solve(50);
		assert.equal(result, 40);
	});
});

console.time();
console.log(solve(5000));
// console.log(solve(1000000));
console.timeEnd();
debugger;
