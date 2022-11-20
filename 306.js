const minimumExcluded = (numbers) => {
	numbers = numbers.sort(Array.SORT_ASCENDING);
	if(numbers[0] !== 0) { return 0; }
	for(const [i, num] of numbers.entries()) {
		if(numbers[i + 1] > num + 1) {
			return num + 1;
		}
	}
	return numbers[numbers.length - 1] + 1;
};
testing.addUnit("minimumExcluded()", minimumExcluded, [
	[[0, 1, 2], 3],
	[[2, 1, 0], 3],
	[[1, 2, 3], 0],
	[[0, 1, 2, 4, 5], 3],
	[[], 0]
]);

const numWinningPositions = (upperBound) => {
	let result = 0;
	const grundyValues = [0];
	for(let currentPosition = 1; currentPosition <= upperBound; currentPosition ++) {
		const options = []; // list of Grundy values for each of the options that the current player has
		for(let currentMove = 0; currentMove < currentPosition - 1; currentMove ++) {
			const leftPosition = grundyValues[currentMove];
			const rightPosition = grundyValues[currentPosition - currentMove - 2];
			options.push(leftPosition ^ rightPosition);
		}
		const grundyValue = minimumExcluded(options);
		grundyValues[currentPosition] = grundyValue;
		if(grundyValue !== 0) {
			result ++;
		}
		if(currentPosition % 1000 === 0) {
			console.log(`calculated up to ${currentPosition}`);
		}
	}
	return result;
};

testing.addUnit("numWinningPositions()", numWinningPositions, [
	[5, 3],
	[50, 40]
]);
