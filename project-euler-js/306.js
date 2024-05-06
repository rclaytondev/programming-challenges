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
		for(let currentMove = 0; currentMove < Math.floor(currentPosition / 2); currentMove ++) {
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
	// console.log(grundyValues);
	console.log(grundyValues.slice(0, 34));
	console.log(grundyValues.slice(34, 34 * 2));
	console.log(grundyValues.slice(34 * 2, 34 * 3));
	console.log(grundyValues.slice(34 * 3, 34 * 4));
	console.log(grundyValues.slice(34 * 4, 34 * 5));
	console.log(grundyValues.slice(34 * 5, 34 * 6));
	console.log(grundyValues.slice(34 * 6, 34 * 7));
	console.log(grundyValues.slice(34 * 7, 34 * 8));
	console.log(grundyValues.slice(34 * 8, 34 * 9));
	console.log(grundyValues.slice(34 * 9, 34 * 10));
	console.log(grundyValues.slice(34 * 10, 34 * 11));
	console.log(grundyValues.slice(34 * 11, 34 * 12));
	const losingPositions = grundyValues.map((v, i) => v === 0 ? i : null).filter(v => v !== null);
	debugger;
	return result;
};

testing.addUnit("numWinningPositions()", numWinningPositions, [
	// [5, 3],
	// [50, 40]
]);
numWinningPositions(500);
