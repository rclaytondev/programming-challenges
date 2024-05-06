const BASE_10_DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

const solve = (numPermutedCubes = 5) => {
	let digitCountsMap = {};
	let upperBound = Infinity;
	let candidates = [];
	for(let i = 1; i ** 3 < upperBound; i ++) {
		const cube = i ** 3;
		const digits = cube.digits();
		const digitCounts = `${BASE_10_DIGITS.map(d => digits.count(d))}`;
		digitCountsMap[digitCounts] ??= { numPermutedCubes: 0, firstCube: cube };
		digitCountsMap[digitCounts].numPermutedCubes ++;
		if(digitCountsMap[digitCounts].numPermutedCubes === numPermutedCubes) {
			upperBound = Math.min(upperBound, 10 ** digits.length);
			candidates.push(digitCountsMap[digitCounts].firstCube);
		}
	}
	return candidates.min();
};
