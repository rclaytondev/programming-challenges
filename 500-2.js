let iterations = 0;

const leastWith2ToTheNDivisors = (log2OfDivisors) => {
	let smallestNumber = Infinity;
	for(const exponents of Tree.iterate([], function*(exponents) {
		if(
			exponents.map(e => e + 1).product() >= 2 ** log2OfDivisors // too many divisors
			|| Math.defactorize(exponents) >= smallestNumber // number is too large
		) { return; }
		const lastExponent = exponents[exponents.length - 1];
		const lastPrime = Sequence.PRIMES.nthTerm(exponents.length - 1);
		const nextPrime = Sequence.PRIMES.nthTerm(exponents.length);
		let minExponent = (exponents.length === 0) ? 1 : (lastExponent + 1) / 2 * Math.logBase(nextPrime, lastPrime) - 1;
		let maxExponent = (exponents.length) ? Math.min(
			exponents[exponents.length - 1],
			2 * (lastExponent + 1) * Math.logBase(nextPrime, lastPrime) - 1
		) : Math.sqrt(2 * (2 ** log2OfDivisors) / Math.logBase(3, 2)) - 1;
		for(
			let exponent = (minExponent <= 1) ? 1 : Math.max(1, 2 ** (Math.floor(Math.log2(minExponent))) - 1);
			exponent <= Math.floor(maxExponent);
			exponent = exponent * 2 + 1
		) { yield [...exponents, exponent]; }
	}, false, "bfs")) {
		iterations ++;
		const divisors = exponents.map(e => e + 1).product();
		const number = Math.defactorize(exponents);
		if(number < smallestNumber && divisors === 2 ** log2OfDivisors) {
			smallestNumber = number;
		}
	}
	return smallestNumber;
};
testing.addUnit(leastWith2ToTheNDivisors, [
	[2, 6n],
	[3, 24n],
	[4, 120n],
	[5, 840n],
	[6, 7560n],
	[7, 83160n]
]);



iterations = 0;
leastWith2ToTheNDivisors(50);
console.log(`iterations: ${iterations}`);
