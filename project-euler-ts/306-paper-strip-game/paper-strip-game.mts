import { describe } from "mocha";
import { ArrayUtils } from "../../utils-ts/modules/core-extensions/ArrayUtils.mjs";
import { minimumExcludant } from "../899-distribunim-I/distribunim-I.mjs";
import { assert } from "chai";

export const solve = (upperBound: number) => {
	const grundyValues = [0, 0];
	while(grundyValues.length <= upperBound) {
		const options = ArrayUtils.range(0, Math.ceil((grundyValues.length - 2) / 2)).map(
			n => grundyValues[n] ^ grundyValues[grundyValues.length - 2 - n]
		);
		grundyValues.push(minimumExcludant(options));
	}
	return grundyValues.filter(n => n !== 0).length;
};

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
