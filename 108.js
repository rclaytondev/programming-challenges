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

testing.addUnit("numSolutions()", numSolutions, [
	[4, 3] // (5, 20), (6, 12), (8, 8)

]);
testing.testAll();


const isPrime = (number) => {
	const upperBound = Math.sqrt(number);
	if(number % 2 === 0) { return false; }
	for(let i = 3; i <= upperBound; i += 2) {
		if(number % i === 0) { return false; }
	}
	return true;
};
const getNextPrime = (searchStart) => {
	for(let i = searchStart + 1; i < Infinity; i ++) {
		if(isPrime(i)) {
			return i;
		}
	}
};


const UPPER_SEARCH_BOUND = 1000000;
let primes = new Set([2, 3, 5, 7]);
let nextPrime = getNextPrime([...primes].max());
let numbersToSkip = new Set([]);
let foundEnoughSolutions = false;

console.time("solving the problem");
for(let n = 0; n < UPPER_SEARCH_BOUND; n ++) {
	if(numbersToSkip.has(n)) {
		console.log(`skipped calculations for n=${n}`);
		numbersToSkip.delete(n);
		continue;
	}
	if(n >= nextPrime && !foundEnoughSolutions) {
		const primesProduct = [...primes].reduce((a, c) => a * c, 1) * nextPrime;
		const solutions = numSolutions(primesProduct);
		console.log(`calculated for n=${n}`);
		if(solutions < 1000) {
			/* since this doesn't have enough solutions, we can skip the calculations for all of its divisors */
			const divisors = primes.subsets().map(set => [...set].reduce((a, c) => a * c, 1) * nextPrime);
			divisors.forEach(divisor => { numbersToSkip.add(divisor); });
			primes.add(nextPrime);
			nextPrime = getNextPrime([...primes].max());
			continue;
		}
		else {
			foundEnoughSolutions = true;
			console.log(`UPPER BOUND ESTABLISHED: 1/x + 1/y = 1/${primesProduct} has over 1000 solutions, but might not be the first`);
		}
	}

	const solutions = numSolutions(n);
	if(solutions > 1000) {
		console.log(`1/x + 1/y = 1/${n} has over 1000 solutions!`);
		break;
	}
}
console.timeEnd("solving the problem");


console.log("finished");
