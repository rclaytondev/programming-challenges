const numCombinations = (size) => {
	const isValid = (combination) => {
		if(combination.length > size) { return false; }
		for(const [i, value] of combination.entries()) {
			if(
				value === "T" &&
				(combination[i + 1] === "F" || (i === combination.length - 1 && combination.length === size)) &&
				(
					(combination[i - 1] ?? "F") === "F" || (combination[i - 2] ?? "F") === "F"
				)
			) { return false; }
		}
		return true;
	};
	let numWays = 0;
	for(const combination of Tree.iterate([], (combination) =>
		[
			[...combination, "T"],
			[...combination, "F"]
		].filter(v => isValid(v))
	)) {
		if(isValid(combination) && combination.length === size) {
			numWays ++;
		}
	}
	return numWays;
};

// const numCombinations = (size) => {
// 	if(size < 3) { return 1; }
// 	if(size === 3) { return 2; }
// 	let numWays = 1;
// 	for(let blockSize = 3; blockSize <= size; blockSize ++) {
// 		numWays += numCombinations(size - (blockSize + 1));
// 	}
// 	for(let gapSize = 1; gapSize <= size; gapSize ++) {
// 		numWays += numCombinations(size - gapSize);
// 	}
// 	return numWays;
// };
testing.addUnit("numCombinations()", {
	"returns the correct result for 4": () => {
		const result = numCombinations(4);
		expect(result).toEqual(4);
	},
	"returns the correct result for 7": () => {
		const result = numCombinations(7);
		expect(result).toEqual(17);
	}
});
testing.testUnit("numCombinations()");
