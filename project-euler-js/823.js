const solve = (upperBound = 1000, iterations = 10 ** 16) => {
	const initialNumbers = new Array(upperBound - 1).fill().map((v, i) => i + 2); // 2 to upperBound, inclusive
	const previousIterations = [[...initialNumbers]];
	let numbers = [...initialNumbers];
	for(let i = 0; i < iterations; i ++) {
		let factorProduct = 1;
		let nextNumbers = [];
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
		nextNumbers = nextNumbers.sort((a, b) => a - b);
		numbers = nextNumbers;
		const periodicityIndex = previousIterations.findIndex(iteration => iteration.equals(nextNumbers));
		if(periodicityIndex !== -1) {
			// periodicity detected!
			const periodLength = i - periodicityIndex;
			debugger;
		}
		previousIterations.push(nextNumbers);
	}
	return numbers.sum();
};

testing.addUnit(solve, [
	// [5, 3, 21],
	[10, 100, 257]
]);
