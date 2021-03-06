const DESIRED_SOLUTIONS = 4000000;
const SEARCH_INTERVAL = 10000;

const numSolutions = (n) => {
	/* returns the number of integer solutions to the equation 1/x + 1/y = 1/n. */
	let solutions = 1;
	for(let x = n + 1; x < 2 * n; x ++) {
		const y = (x * n) / (x - n);
		if(y % 1 === 0) {
			solutions ++;
		}
	}
	return solutions;
};
const getDivisors = (number) => {
	/* returns the set of integers the number is divisible by, including 1 and itself. */
	const upperBound = Math.sqrt(number);
	let divisors = new Set([1, number]);
	for(let i = 2; i <= upperBound; i ++) {
		if(number % i === 0) {
			divisors.add(i);
			divisors.add(number / i);
		}
	}
	return divisors;
};

testing.addUnit("numSolutions()", numSolutions, [
	[4, 3] // (5, 20), (6, 12), (8, 8)
	[1260, 113]
]);
testing.addUnit("getDivisors()", getDivisors, [
	[2, new Set([1, 2])],
	[3, new Set([1, 3])],
	[4, new Set([1, 2, 4])],
	[10, new Set([1, 2, 5, 10])],
	[36, new Set([1, 2, 3, 4, 6, 9, 12, 18, 36])]
]);
testing.testAll();


const leastInRangeWithSolutions = (numDesiredSolutions, lowerBound, upperBound) => {
	const possibleAnswers = [];
	const numbersToSkip = new Set([]);
	for(let i = upperBound; i >= lowerBound; i --) {
		if(!numbersToSkip.has(i)) {
			const solutions = numSolutions(i);
			if(solutions >= numDesiredSolutions) {
				possibleAnswers.push(i);
			}
			else {
				const divisors = getDivisors(i);
				divisors.delete(i);
				divisors.forEach(divisor => numbersToSkip.add(divisor));
			}
		}
		else {
			console.log(`skipping calculations for ${i}`);
			numbersToSkip.delete(i);
		}
	}
	return possibleAnswers.min();
};
const leastWithSolutions = (numDesiredSolutions) => {
	debugger;
	for(let i = numDesiredSolutions; i < Infinity; i += SEARCH_INTERVAL) {
		const lowerBound = i;
		const upperBound = i + SEARCH_INTERVAL;
		const result = leastInRangeWithSolutions(numDesiredSolutions, lowerBound, upperBound);
		if(result) { return result; }
	}
};

// console.time("solving the problem");
// console.log(leastWithSolutions(DESIRED_SOLUTIONS));
// console.timeEnd("solving the problem");
