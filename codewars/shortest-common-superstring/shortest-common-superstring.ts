import { describe, it } from "mocha";
import { assert } from "chai";

const shortestCommonSuperstring = function(strings: string[]): string {
	return strings.join("");
};

function testSCS(words: string[], expected: string) {
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
}

describe("shortestCommonSuperstring", () => {
	it("works for two strings", () => {
		testSCS(["abc", "cde"], "abcde");
	});
});
