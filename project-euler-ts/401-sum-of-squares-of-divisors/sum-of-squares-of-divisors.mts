const sumOfSquares = (lower: bigint, upper: bigint) => {
	const upperSquareSum = upper * (upper + 1n) * (2n * upper + 1n) / 6n;
	const lowerSquareSum = (lower - 1n) * lower * (2n * lower - 1n) / 6n;
	return upperSquareSum - lowerSquareSum;
};

export const divSqSumSum = (upperBound: bigint, modulo: bigint = 10n ** 9n) => {
	let result = 0n;
	let intervalStart = 1n;
	while(intervalStart <= upperBound) {
		const multiplier = upperBound / intervalStart;
		const intervalEnd =  upperBound / multiplier;
		result += (multiplier * sumOfSquares(intervalStart, intervalEnd) % modulo);
		result %= modulo;
		intervalStart = intervalEnd + 1n;
	}
	return result;
};
// console.log(divSqSumSum(10n ** 15n));
// debugger;
