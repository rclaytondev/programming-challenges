const solve = (upperBound = 1000, iterations = 10 ** 16) => {
	const initialNumbers = new Array(upperBound - 1).fill().map((v, i) => i + 2); // 2 to upperBound, inclusive
	let numbers = [...initialNumbers];
	for(let i = 0; i < iterations; i ++) {
		let factorProduct = 1;
		const nextNumbers = [];
		for(const num of numbers) {
			let smallestFactor;
			for(const prime of Sequence.PRIMES) {
				if(num % prime === 0) {
					smallestFactor = prime;
					factorProduct *= smallestFactor;
					break;
				}
			}
			if(num !== smallestFactor) { nextNumbers.push(num / smallestFactor); }
		}
		nextNumbers.push(factorProduct);
		numbers = nextNumbers;
		console.log(numbers);
	}
	return numbers.sum();
};

testing.addUnit(solve, [
	[5, 3, 21],
	[10, 100, 257]
]);
