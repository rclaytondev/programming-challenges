const sumOfSquares = (lower: number, upper: number) => {
	let sum = 0;
	for(let i = lower; i <= upper; i ++) {
		sum += i ** 2;
	}
	return sum;
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
