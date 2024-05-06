const primesBelow = (n) => {
	/* Returns a list of all the primes below the number. Implements the Sieve of Eratosthenes. */
	let numbers = [];
	for(let i = 2; i < n; i ++) {
		numbers.push(i);
	}

	let indicesProcessed = 0;
	const max = Math.sqrt(n);
	while(numbers[indicesProcessed] < Math.sqrt(n)) {
		numbers = numbers.filter(n => n % numbers[indicesProcessed] !== 0 || n === numbers[indicesProcessed]);
		indicesProcessed ++;
	}
	return numbers;
};
console.log(primesBelow(1e6)[10000]);
