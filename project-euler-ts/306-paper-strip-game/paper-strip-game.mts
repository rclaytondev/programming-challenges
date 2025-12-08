import { describe } from "mocha";
import { minimumExcludant } from "../899-distribunim-I/distribunim-I.mjs";
import { assert } from "chai";

export const solve = (upperBound: number) => {
	const grundyValues = [0, 0];
	while(grundyValues.length <= upperBound) {
		const options = [];
		for(let i = 0; i <= (grundyValues.length - 2) / 2; i ++) {
			options.push(grundyValues[i] ^ grundyValues[grundyValues.length - 2 - i]);
		}
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
console.log(solve(40000));
// console.log(solve(1000000));
console.timeEnd();
debugger;
