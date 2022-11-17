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
	/* returns the number of strings of distinct characters such that exactly one character comes lexicographically after its predecessor in the string. */
	return combination(alphabetSize, length) * (2 ** length - length - 1);
};

testing.addUnit("numStrings()", numStrings, [
	[3, 26, 10400]
]);

const solve = () => {
	let max = -Infinity;
	for(let n = 1; n <= 26; n ++) {
		const num = numStrings(n);
		console.log(num);
		if(num > max) {
			max = Math.max(max, num);
		}
	}
	return max;
};
