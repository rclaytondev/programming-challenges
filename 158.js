const combination = (n, r) => {
	if(n < 0 || r < 0 || r > n) { return 0; }
	let result = 1;
	for(let i = n - r + 1; i <= n; i ++) {
		result *= i;
	}
	for(let i = 2; i <= r; i ++) {
		result /= i;
	}
	return result;
};
const numIncreasingSequences = (numTerms, min, max) => combination(numTerms + (max - min), numTerms);
testing.addUnit("numIncreasingSequences()", [
	[3, 1, 2, 4] // 4 sequences: 111, 112, 122, 222
]);

const numStrings = (length, alphabetSize = 26) => {
	/* returns the number of strings such that exactly one character comes lexicographically after its predecessor in the string. */
	let result = 0;
	for(let index = 0; index < length; index ++) {
		for(let firstCharID = 1; firstCharID < alphabetSize; firstCharID ++) {
			for(let secondCharID = 0; secondCharID < firstCharID; secondCharID ++) {
				const combinationsBefore = numIncreasingSequences(index, 0, firstCharID);
				const combinationsAfter = numIncreasingSequences(length - index - 2, secondCharID, alphabetSize - 1);
				result += combinationsBefore * combinationsAfter; // number of strings where at index `index`, there is a `firstCharID` character that decreases to a `secondCharID` character at the index `index + 1`.
			}
		}
	}
	return result;
};

testing.addUnit("numStrings()", numStrings, [
	[3, 2, 4],
	[3, 26, 10400]
]);
