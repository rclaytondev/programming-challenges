const solve = () => {
	let primesBelow = [];
	let highestPrime = -Infinity;
	for(const prime of Sequence.PRIMES) {
		for(const subArray of primesBelow.subArrays()) {
			if(subArray.sum() === prime) {
				highestPrime = prime;
				break;
			}
		}

		primesBelow.push(prime);
		if(prime >= 1e6) {
			break;
		}
	}
	return highestPrime;
};
