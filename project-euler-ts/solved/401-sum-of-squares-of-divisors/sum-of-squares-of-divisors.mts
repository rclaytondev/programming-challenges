const sumOfSquares = (lower: bigint, upper: bigint) => {
	const upperSquareSum = upper * (upper + 1n) * (2n * upper + 1n) / 6n;
	const lowerSquareSum = (lower - 1n) * lower * (2n * lower - 1n) / 6n;
	return upperSquareSum - lowerSquareSum;
};

export const divSqSumSum = (upperBound: number, modulo: bigint = 10n ** 9n) => {
	let result = 0n;
	let intervalStart = 1;
	while(intervalStart <= upperBound) {
		const multiplier = Math.floor(upperBound / intervalStart);
		const intervalEnd = Math.floor(upperBound / multiplier);
		result += (BigInt(multiplier) * sumOfSquares(BigInt(intervalStart), BigInt(intervalEnd)) % modulo);
		result %= modulo;
		intervalStart = intervalEnd + 1;
	}
	return result;
};
// console.time();
// console.log(divSqSumSum(10 ** 15));
// console.timeEnd();
// debugger;
