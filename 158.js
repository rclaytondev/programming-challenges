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

const numStrings = (length, alphabetSize = 26) => {
	/* returns the number of strings such that exactly one character comes lexicographically after its predecessor in the string. */
	let result = 0;
	for(let index = 1; index < length; index ++) {
		for(let charID = 0; charID < alphabetSize; charID ++) {
			const combinationsBefore = combination(index + charID, index);
			const combinationsAfter = combination((length - index - 1) + (alphabetSize - charID - 1), alphabetSize - charID - 1);
			result += combinationsBefore * combinationsAfter;
		}
	}
	return result;
};

testing.addUnit("numStrings()", numStrings, [
	[3, 2, 4],
	[3, 26, 10400]
]);
