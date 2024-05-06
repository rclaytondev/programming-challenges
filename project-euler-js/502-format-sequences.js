const numFormatSequences = (n) => {
	/* returns the number of sequences containing n 1's and n -1's such that all the partial sums are nonnegative. */
	let result = 0;
	outerLoop: for(const sequence of new Set([-1, 1]).cartesianPower(2 * n)) {
		for(let i = 0; i <= sequence.length; i ++) {
			if(sequence.slice(0, i).sum() < 0) { continue outerLoop; }
		}
		if(sequence.sum() === 0) {
			result ++;
		}
	}
	return result;
};
testing.addUnit(numFormatSequences, [
	[1, 1],
	[2, 2],
	[3, 5]
]);

// the sequence goes 1, 2, 5, 14, 42, 132, 429, 1430, 4862, 16796
