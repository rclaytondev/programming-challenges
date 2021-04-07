const intLog = ((base, number) => {
	/*
	Returns the maximum exponent `base` can be raised to while still being less
	than or equal to `number`.
	*/
	if(typeof number === "bigint") { base = BigInt(base); }
	let result = (typeof number === "bigint") ? 0n : 0;
	while(number / base >= 1) {
		number /= base;
		result ++;
	}
	return result;
}).memoize(true);
const isPrime = (number) => {
	const upperBound = Math.sqrt(number);
	if(number % 2 === 0 && number !== 2) { return false; }
	for(let i = 3; i <= upperBound; i += 2) {
		if(number % i === 0) { return false; }
	}
	return true;
};
const getNextPrime = (prime) => {
	for(let i = prime + 1; i < Infinity; i ++) {
		if(isPrime(i)) {
			return i;
		}
	}
};
const firstNPrimes = (numPrimes) => {
	const primes = [2];
	while(primes.length < numPrimes) {
		const lastPrime = primes.lastItem();
		const nextPrime = getNextPrime(lastPrime);
		primes.push(nextPrime);
	}
	return primes;
};

const middleOutIteration = function*(min, max) {
	/* Yields each integer between integer bounds min and max (inclusive).
	Iteration order, where `m` is the rounded average of `min` and `max`:
	`m`, then `m + 1`, then `m - 1`, then `m + 2`, then `m - 2`, and so on.
	*/

	min = Number(min); max = Number(max);

	const middle = Math.ceil((min + max) / 2);
	yield middle;
	for(let i = 1; i <= (max - min) / 2 + 1; i ++) {
		if(middle + i <= max) { yield middle + i; }
		if(middle - i >= min) { yield middle - i; }
	}
};
const stringifyFactorization = (bases, exponents) => {
	return (
		bases
		.map((p, i) => `${p}^${exponents[i]}`)
		.filter(s => !s.endsWith("^0"))
		.map(s => s.replaceAll("^1", ""))
		.join(" * ")
	);
};

const divideBigInts = (bigint1, bigint2) => {
	const BIG_NUMBER = 1e10;
	return Number(bigint1 * BigInt(BIG_NUMBER) / bigint2) / BIG_NUMBER;
};
const getUpperBound = (desiredSquareDivisors) => {
	let primes = [2];
	let primeExponents = [1]; // start off with prime factorization = 2^1
	const numDivisors = (primeExponents) => {
		return (
			primeExponents
			.map(exponent => 2 * exponent + 1)
			.product()
		);
	};
	const deFactorize = (primes, exponents) => {
		return exponents.map((exp, index) => primes[index] ** exp).product();
	};
	debugger;
	while(numDivisors(primeExponents) < desiredSquareDivisors) {
		const nextSteps = primeExponents.map((exponent, index) => {
			const exponentsBefore = primeExponents.slice(0, index);
			const exponentsAfter = primeExponents.slice(index + 1);
			const newExponents = [
				...exponentsBefore,
				3 * exponent + 1,
				...exponentsAfter
			];
			return {
				exponents: newExponents,
				product: deFactorize(primes, newExponents)
			};
		});
		if(primes.length < primeExponents.length + 1) {
			primes.push(getNextPrime(primes.lastItem()));
		}
		nextSteps.push({
			exponents: [...primeExponents, 1],
			product: deFactorize(primes, [...primeExponents, 1])
		});
		const nextStep = nextSteps.min(step => step.product);
		primeExponents = nextStep.exponents;
	}
	return deFactorize(primes, primeExponents);
};
const leastWithNSquareDivisors = (desiredSquareDivisors) => {
	/* returns the lowest positive integer whose square has at least the
	required number of divisors. */
	const logOfInput = Math.ceil(Math.logBase(3, desiredSquareDivisors));
	const primes = firstNPrimes(logOfInput);
	const upperBound = getUpperBound(desiredSquareDivisors);
	const maxPrimeExponents = primes.map(prime => intLog(prime, upperBound));
	let result = BigInt(upperBound);
	console.log(`initial upper bound is ${result}`);
	const checkCombination = (exponents, product) => {
		if(exponents.length === primes.length) {
			const divisorsOfSquare = (exponents
				.map(val => 2 * val + 1)
				.reduce((product, val) => product * BigInt(val), 1n)
			);
			if(divisorsOfSquare > desiredSquareDivisors && product < result) {
				console.log(`upper bound is now ${product} (= ${stringifyFactorization(primes, exponents)})`);
				result = product;
			}
			return;
		}

		const nextPrime = primes[exponents.length];
		const maxExponent = intLog(nextPrime, result / product);
		for(let exponent = 0; exponent <= intLog(nextPrime, result / product); exponent ++) {
		// for(let exponent of middleOutIteration(0, maxExponent)) {
			checkCombination(
				[...exponents, exponent],
				product * BigInt(nextPrime ** exponent)
			);
		}
	};
	checkCombination([], 1n);
	console.log(`the answer is ${result}`);
	return result;
};

const DESIRED_SOLUTIONS = 400000;
const solve = ((desiredSolutions = DESIRED_SOLUTIONS) => {
	const desiredSquareDivisors = 2 * desiredSolutions;
	return leastWithNSquareDivisors(desiredSquareDivisors);
});

console.time("solving the problem");
solve();
console.timeEnd("solving the problem");
