import { describe, it } from "mocha";
import { assert } from "chai";

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

const shortestCommonSuperstring = function(strings: string[]): string {
	return strings.join("");
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
describe("shortestCommonSuperstring", () => {
	it("works for two strings", () => {
		testSCS(["abc", "cde"], "abcde");
	});
});
