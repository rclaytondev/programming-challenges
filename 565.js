const productPartitions = (number, lowerBound = 0) => {
	if(number === 1) { return [[]]; }
	if(Math.isPrime(number) && number >= lowerBound) { return [[number]]; }

	let results = [];
	for(const divisor of Math.divisors(number)) {
		if(divisor !== 1 && divisor >= lowerBound) {
			results = results.concat(productPartitions(number / divisor, divisor).map(array => [divisor, ...array]));
		}
	}
	return results;
};
const sumOfPrimePowers = (number) => {
	/* returns the list of all primes p such that `number` can be expressed as a sum of consecutive powers of p, starting with 1. */
	const possiblePrimes = Math.factorize(number - 1).deduplicate();
	return possiblePrimes.filter(p => {
		return Math.logBase(p, number * (p - 1) + 1) % 1 === 0;
	});
};

const calculateSum = (upperBound, divisorOfSum) => {
	const answers = new Set();
	const maxDivisorSum = (upperBound + Math.sqrt(upperBound)) / 2 + upperBound * Math.log(Math.sqrt(upperBound));
	for(let multiplier = 1n; BigInt(divisorOfSum) * multiplier <= maxDivisorSum; multiplier ++) {
		const multiple = BigInt(divisorOfSum) * multiplier;
		const ways = sumOfPrimePowers(Number(multiple));
		for(const prime of ways) {
			const exponent = Math.logBase(prime, Number(multiple) * (prime - 1) + 1) - 1;
			for(let multiplier = 0; multiplier * (prime ** exponent) <= upperBound; multiplier ++) {
				if(multiplier % prime !== 0) {
					answers.add(multiplier * (prime ** exponent));
				}
			}
		}
	}
	return [...answers].sum();
};
testing.addUnit(productPartitions, [
	[10, [[2, 5], [10]]],
	[12, [[2, 2, 3], [2, 6], [3, 4], [12]]],
	[36, [[2, 2, 3, 3], [2, 2, 9], [2, 3, 6], [2, 18], [3, 3, 4], [3, 12], [4, 9], [6, 6], [36]]]
]);
testing.addUnit(sumOfPrimePowers, [
	[5, []],
	[4, [3]],
	[31, [2, 5]]
]);
testing.addUnit(calculateSum, [
	[20, 7, 49],
	[1e6, 2017, 150850429n],
	// [1e9, 2017, 249652238344557n],


	[100, 7, 1419],
	// [1000, 17, 18342],
	// [10000, 17, 2956152]
]);
