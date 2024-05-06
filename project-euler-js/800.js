const numHybridIntegers = (upperBound = (800800n ** 800800n)) => {
	upperBound = BigInt(upperBound);
	let count = 0n;
	for(let firstPrime of Sequence.PRIMES.termsBelow(upperBound)) {
		const maxSecondPrime = utils.binarySearch(
			0n,
			BigInt(Math.round(Math.log2(Number(upperBound)))),
			(q) => BigInt(firstPrime) ** q * q ** BigInt(firstPrime) - upperBound
		);
		count += BigInt(Sequence.PRIMES.termsBelow(maxSecondPrime).length);
		if(maxSecondPrime > firstPrime) {
			count --; // primes must be distinct
		}
		if(Math.isPrime(maxSecondPrime) && BigInt(firstPrime) ** maxSecondPrime * maxSecondPrime ** BigInt(firstPrime) <= upperBound) {
			count += 1n;
		}
	}
	return count / 2n; // order doesn't matter -- 2^5 * 5^2 is the same as 5^2 * 2^5
};
testing.addUnit("numHybridIntegers()", numHybridIntegers, [
	// sequence of hybrid integers: 72, 800, 6272, 30375, 750141, 247808, ...
	[799, 1n],
	[800n, 2n],
	[6271n, 2n],
	[6272n, 3n],
	[30374n, 3n],
	[30375n, 4n],
	// [750141n, 5n],
	// [247808, 6n],

	// [800n ** 800n, 10790n]
]);
