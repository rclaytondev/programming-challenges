import { describe, it } from "mocha";
import { assert, expect } from "chai";

const concatWithOverlap = function(strings: string[]): string {
	if(strings.length === 1) {
		return strings[0];
	}
	if(strings.length === 2) {
		const [string1, string2] = strings;
		for(let i = string2.length; i >= 0; i --) {
			if(string1.endsWith(string2.substring(0, i))) {
				return string1.substring(0, string1.length - i) + string2;
			}
		}
	}
	return concatWithOverlap([concatWithOverlap(strings.slice(0, 2)), ...strings.slice(2)]);
};

const distinctPermutations = function*<T>(array: T[]): Generator<T[], void, unknown> {
	if(array.length === 0) { yield [] as T[]; return; }
	if(array.length === 1) { yield [...array]; return; }
	for(const [index, item] of array.entries()) {
		if(!array.slice(0, index).includes(item)) {
			for(const permutation of distinctPermutations(array.filter((v, i) => i !== index))) {
				yield [item, ...permutation];
			}
		}
	}
};

const shortestCommonSuperstring = function(strings: string[]): string {
	if(strings.length === 0) { return ""; }
	let shortest = concatWithOverlap(strings);
	for(const permutation of distinctPermutations(strings)) {
		const concatenation = concatWithOverlap(permutation);
		if(concatenation.length < shortest.length) {
			shortest = concatenation;
		}
	}
	return shortest;
};

const testSCS = function(words: string[], expected: string) {
	const result = shortestCommonSuperstring(words);
	assert(
		words.every(word => result.includes(word)),
		`Shortest common string: "${result}" should contain all of the words: ${words.join(",")}`,
	);

	assert.equal(
		expected.length,
		result.length,
		`SCS should be no longer than "${expected.length}" (e.g. "${expected}"), got "${result.length}" ("${result}") instead.`,
	); 
};

describe("concatWithOverlap", () => {
	it("returns the strings concatenated with the overlap removed", () => {
		assert.equal(concatWithOverlap(["ABC", "CDE"]), "ABCDE");
	});
	it("works when there are more than two strings", () => {
		assert.equal(concatWithOverlap(["ABC", "CDE", "DEF"]), "ABCDEF");
	});
	it("works when there is only one string", () => {
		assert.equal(concatWithOverlap(["ABC"]), "ABC");
	});
	it("works when some of the strings are equal", () => {
		assert.equal(concatWithOverlap(["ABC", "DEF", "DEF", "EFG"]), "ABCDEFG");
	});
});
describe("distinctPermutations", () => {
	it("yields all the distinct permutations of the given array", () => {
		const result = [...distinctPermutations([1, 2, 3])];
		expect(result).to.have.deep.members([
			[1, 2, 3],
			[1, 3, 2],
			[2, 1, 3],
			[2, 3, 1],
			[3, 1, 2],
			[3, 2, 1],
		]);
	});
	it("only yields each permutation once, even when there are duplicates in the given array", () => {
		const result = [...distinctPermutations([1, 2, 2])];
		expect(result).to.have.deep.members([
			[1, 2, 2],
			[2, 1, 2],
			[2, 2, 1],
		]);
	});
});
describe("shortestCommonSuperstring", () => {
	it("works for two strings", () => {
		testSCS(["abc", "cde"], "abcde");
	});
	it("works when there are no strings", () => {
		testSCS([], "");
	});
});
