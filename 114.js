const getCombinations = (size) => {
	if(size < 0) { return []; }
	if(size < 3) { return [ new Array(size).fill(false) ]; }
	if(size === 3) {
		return [
			[false, false, false],
			[true, true, true]
		];
	}
	let combinations = [];
	combinations.push(new Array(size).fill(true));
	for(let blockSize = 3; blockSize < size; blockSize ++) {
		for(const combination of getCombinations(size - (blockSize + 1))) {
			combinations.push([
				...new Array(blockSize).fill(true),
				false,
				...combination
			]);
		}
	}
	for(const combination of getCombinations(size - 1)) {
		combinations.push([ false, ...combination ]);
	}
	return combinations;
};
const numCombinations = ((size) => {
	if(size < 0) { return 0; }
	if(size < 3) { return 1; }
	if(size === 3) { return 2; }
	let numWays = 1;
	for(let blockSize = 3; blockSize < size; blockSize ++) {
		numWays += numCombinations(size - (blockSize + 1));
	}
	numWays += numCombinations(size - 1);
	return numWays;
}).memoize(true);
testing.addUnit("getCombinations()", {
	"returns the correct result for 4": () => {
		const result = getCombinations(4);
		expect(result.length).toEqual(4);
	}
});
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
