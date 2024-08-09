const sumOfSquares = (lower: number, upper: number) => {
	const upperSquareSum = 1/6 * upper * (upper + 1) * (2 * upper + 1);
	const lowerSquareSum = 1/6 * (lower - 1) * lower * (2 * lower - 1);
	return upperSquareSum - lowerSquareSum;
};

export const divSqSumSum = (upperBound: number) => {
	let result = 0;
	let intervalStart = 1;
	while(intervalStart <= upperBound) {
		const multiplier = Math.floor(upperBound / intervalStart);
		const intervalEnd =  Math.floor(upperBound / multiplier);
		result += multiplier * sumOfSquares(intervalStart, intervalEnd);
		intervalStart = intervalEnd + 1;
	}
	return result;
};
