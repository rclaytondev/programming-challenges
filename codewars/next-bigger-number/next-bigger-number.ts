import { describe, it } from "mocha";
import { assert } from "chai";

const toDigits = (num: number): number[] => {
	return `${num}`.split("").map(d => Number.parseInt(d));
};
const fromDigits = (digits: number[]): number => {
	return Number.parseInt(digits.join(""));
};
const removeFirstDigit = (num: number): number => {
	return fromDigits(toDigits(num).slice(1));
};

const digitPermutationsAbove = function*(digits: number[], lowerBound: number, addedGreaterDigit: boolean = false): Generator<number[], void, unknown> {
	if(digits.length === 0) { yield []; return; }
	if(digits.length === 1) { yield [...digits]; return; }
	for(const [index, digit] of digits.entries()) {
		if(!digits.slice(0, index).includes(digit) && (addedGreaterDigit || digit >= toDigits(lowerBound)[0])) {
			for(const permutation of digitPermutationsAbove(
				digits.filter((_v, i) => i !== index),
				removeFirstDigit(lowerBound),
				addedGreaterDigit || digit > toDigits(lowerBound)[0],
			)) { yield [digit, ...permutation]; }
		}
	}
};

export const nextBigger = function(input: number): number {
	const permutations = [...digitPermutationsAbove(toDigits(input), input)]
		.map(digits => fromDigits(digits))
		.filter(n => n !== input);
	// console.log(permutations);
	if(permutations.length <= 0) { return -1; }
	return Math.min(...permutations);
};


const testCases = [
	[12, 21],
	[513, 531],
	[2017, 2071],
	[414, 441],
	[144, 414],
	// [123456789, 123456798],
	// [1234567890, 1234567908],
	// [9876543210, -1],
	// [9999999999, -1],
	// [59884848459853, 59884848483559],
];
describe("nextBigger", () => {
	for(const [input, output] of testCases) {
		it(`returns ${output} for the input ${input}`, () => {
			assert.equal(nextBigger(input), output);
		});
	}
});
describe("removeFirstDigit", () => {
	it("returns the number with the first digit removed", () => {
		assert.equal(removeFirstDigit(12345), 2345);
	});
});
