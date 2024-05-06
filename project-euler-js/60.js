// Math.isPrime = Math.isPrime.memoize(true);

// tests = [];

const tuplesWithSumBelow = ((numbers, tupleSize, upperBound) => {
	console.log([numbers, tupleSize, upperBound]);
	if(tupleSize === 1) {
		return new Set(numbers.map(n => [n]));
	}
	const result = new Set();
	for(const tuple of tuplesWithSumBelow(numbers, tupleSize - 1, upperBound)) {
		for(const number of numbers.filter(n => n > tuple[tuple.length - 1])) {
			if(tuple.sum() + number < upperBound) {
				result.add([...tuple, number]);
			}
		}
	}
	return result;
}).memoize();
testing.addUnit("tuplesWithSumBelow()", [
	() => {
		const numbers = [1, 2, 3];
		const tuples = tuplesWithSumBelow(numbers, 2, 5);
		expect(tuples).toEqual(new Set([
			[1, 2],
			[1, 3]
		]));
	}
]);

const allConcatsPrime = (numbers) => {
	for(const num1 of numbers) {
		for(const num2 of numbers) {
			if(num1 !== num2 && !Math.isPrime(Number.parseInt(`${num1}${num2}`))) {
				return false;
			}
		}
	}
	return true;
};
testing.addUnit("allConcatsPrime()", allConcatsPrime, [
	[[3, 7, 109, 673], true],
	[[3, 5], false]
]);

const solve = (numPrimes) => {
	let initialSum = (numPrimes % 2 === 0) ? 790 : 791;
	for(let sum = initialSum; sum < 900; sum += 2) {
		console.log(`sum = ${sum}`);
		const primes = Sequence.PRIMES.termsBelow(sum).filter(p => p !== 2 && p !== 5);
		const primesMod1 = primes.filter(p => p % 3 === 1);
		const primesMod2 = primes.filter(p => p % 3 === 2);
		for(const currentPrimeSet of [primesMod1, primesMod2]) {
			const tuples = tuplesWithSumBelow(currentPrimeSet, numPrimes - 1, sum - 1);
			for(const incompleteTuple of tuples) {
				const lastNumber = sum - incompleteTuple.sum();
				const tuple = [...incompleteTuple, lastNumber];
				if(!incompleteTuple.includes(lastNumber) && Math.isPrime(lastNumber) && allConcatsPrime(tuple)) {
					return tuple.sort((a, b) => a - b);
				}
			}
		}
	}
};
console.log(`hello`);
testing.addUnit("solve()", solve, [
	[4, [3, 7, 109, 673]]
]);
// console.log(solve(5));
testing.testUnit("solve()");
