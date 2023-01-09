const repeatedSquarings = (base, numSquarings, modulo) => {
	/*
	Similar to Math.modularExponentiate, but this uses a periodicity-based optimization instead of the repeated squaring algorithm.
	This should be faster for extremely large exponents and reasonably small modulos.
	*/
	let results = [];
	let currentSquare = base;
	for(let i = 0; i < numSquarings; i ++) {
		currentSquare = (currentSquare ** 2) % modulo;
		if(results.includes(currentSquare)) {
			const periodLength = results.length - results.indexOf(currentSquare);
			const squaringsLeft = (numSquarings - (i + 1)) % periodLength;
			for(let j = 0; j < squaringsLeft; j ++) {
				currentSquare = (currentSquare ** 2) % modulo;
			}
			return currentSquare;
		}
		results.push(currentSquare);
	}
	return currentSquare;
};

testing.addUnit("repeatedSquarings()", repeatedSquarings, [
	[2, 15, 11, 3]
]);

const solve = (upperBound = 1000, iterations = 10 ** 16, modulo = Infinity) => {
	const initialNumbers = new Array(upperBound - 1).fill().map((v, i) => i + 2); // 2 to upperBound, inclusive
	let numbers = [...initialNumbers];
	let indices = [];
	for(let i = 0; i < iterations; i ++) {
		const smallestIndex = numbers.min(n => n, null, "index");
		numbers[smallestIndex] = (numbers[smallestIndex]) ** 2;
		indices.push(smallestIndex);
		console.log(numbers);

		if(indices.length >= (upperBound - 1)) {
			const lastIndices = indices.slice(-(upperBound - 1));
			if(new Set(lastIndices).size === lastIndices.length) {
				/* periodicity detected */
				const iterationsLeft = iterations - i - 1;
				const completePeriods = Math.floor(iterationsLeft / (upperBound - 1));
				const lastPeriodLength = iterationsLeft % (upperBound - 1);
				let sum = 0;
				for(const [j, number] of initialNumbers.entries()) {
					let numSquarings = completePeriods;
					if(lastIndices.indexOf(j) < lastPeriodLength) { numSquarings ++; }
					sum = (sum + repeatedSquarings(numbers[j], numSquarings, modulo)) % modulo;
				}
				return sum;
			}
		}
	}
	return numbers.sum() % modulo;
};

testing.addUnit("solve()", solve, [
	[2, 5, 2, 0], // 2^(2^5) = 4294967296 = 0 (mod 2)
	[3, 5, 100, 37], // 256 + 81 = 337 = 37 (mod 100)
	[3, 7, 100, 97], // 65536 + 6561 = 72097 = 97 (mod 100)
	[3, 7, 2, 1], // 65536 + 6561 = 72097 = 1 (mod 2)
	[5, 3, 34], // 34 = 16 + 9 + 4 + 5
	[5, 9, 1218], // 1218 = 256 + 81 + 256 + 625
	[10, 100, 1234567891, 845339386],
]);
