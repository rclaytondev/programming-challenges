const numbersOnDiagonal = function*() {
	yield 1;
	let step = 2;
	let currentNum = 1;
	while(true) {
		yield currentNum + step;
		yield currentNum + 2 * step;
		yield currentNum + 3 * step;
		yield currentNum + 4 * step;
		currentNum += 4 * step;
		step += 2;
	}
};
testing.addUnit("numbersOnDiagonal()", {
	"correctly yields the numbers": () => {
		const results = [];
		const generator = numbersOnDiagonal();
		for(let i = 0; i < 13; i ++) { results.push(generator.next().value); }
		expect(results).toEqual([ 1, 3, 5, 7, 9, 13, 17, 21, 25, 31, 37, 43, 49 ]);
	}
});

const solve = () => {
	const generator = numbersOnDiagonal();
	generator.next();
	let squareSize = 1;
	let numbers = [1];
	let numPrimes = 0;
	while(true) {
		squareSize += 2;
		for(let i = 0; i < 4; i ++) {
			const nextNumber = generator.next().value;
			numbers.push(nextNumber);
			if(Math.isPrime(nextNumber)) { numPrimes ++; }
		}
		if(numPrimes / numbers.length < 0.1) {
			return squareSize;
		}
	}
};
