const factors = (number) => {
	let factors = [];
	for(const prime of Sequence.PRIMES) {
		if(number % prime === 0) {
			factors.push(prime)
		}
		while(number % prime === 0) {
			number /= prime;
		}
		if(number === 1) {
			return factors;
		}
	}
};

const numGozintaChains = (function numGozintaChains(start, end) {
	if(arguments.length === 1) {
		return numGozintaChains(1, arguments[0]);
	}
	if(start === end) { return 1; }

	const divisors = Math.divisors(end);
	let result = 0;
	for(const divisor of divisors) {
		if(divisor > start && divisor % start === 0) {
			result += numGozintaChains(divisor, end);
		}
	}
	return result;
}).memoize(true);
const solve = (upperBound = 1e16) => {
	let sum = 0;
	for(let i = 0; i <= upperBound; i ++) {
		if(numGozintaChains(1, i) === i) {
			sum += i;
		}
	}
	return sum;
};

testing.addUnit("numGozintaChains()", numGozintaChains, [
	[1, 12, 8],
	[1, 48, 48],
	[1, 120, 132]
]);
