const solve = (upperBound = 1e6) => {
	let primesBelow = [];
	let highestPrime = -Infinity;
	let mostPrimes = -Infinity;
	loop1: for(const prime of Sequence.PRIMES) {
		if(prime >= upperBound) {
			break;
		}

		loop2: for(let start = 0; start < primesBelow.length; start ++) {
			let sum = 0;
			loop3: for(let end = start; end < primesBelow.length; end ++) {
				sum += primesBelow[end];
				if(sum > prime) { break loop3; }
				else if(sum === prime && end - start > mostPrimes) {
					mostPrimes = end - start;
					highestPrime = prime;
					break loop2;
				}
			}
		}

		primesBelow.push(prime);
	}
	return highestPrime;
};

console.time("solving the problem");
console.log(solve());
console.timeEnd("solving the problem");
