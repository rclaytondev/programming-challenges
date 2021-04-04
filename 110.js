const intLog = (base, number) => {
	/*
	returns the maximum exponent `base` can be raised to while still having
	`number` be divisible by `base.`
	Returns 0 if `number` is not divisible by `base`.
	*/
	let result = 0;
	while(number % base === 0) {
		number /= base;
		result ++;
	}
	return result;
};
const factorizedIntegers = function*() {
	/* Iterates through the positive integers in ascending order, yielding each
	integer and an object representing its prime factors.
	The keys are the primes and values are the exponents on each prime.
	*/
	yield [1, { 1: 1 }];
	const nextPrimeDivisors = []; // the `i`th sub-array contains the distinct prime factors of `i`.
	const primes = [];
	for(let i = 2; i < Infinity; i ++) {
		const distinctFactors = nextPrimeDivisors[i] ?? [];
		if(distinctFactors.length === 0) {
			/* i is prime */
			const factorization = { [i]: 1 };
			yield [i, factorization];

			nextPrimeDivisors[i * 2] ??= [];
			nextPrimeDivisors[i * 2].push(i);
		}
		else {
			const factorization = {};
			for(const factor of distinctFactors) {
				const exponent = intLog(factor, i);
				factorization[factor] = exponent;

				nextPrimeDivisors[i + factor] ??= [];
				nextPrimeDivisors[i + factor].push(factor);
			}
			yield [i, factorization];
		}
		delete nextPrimeDivisors[i];
	}
};
testing.addUnit("factorizedIntegers()", [
	() => {
		let results = [];
		for(const [integer, factorization] of factorizedIntegers()) {
			results.push([integer, factorization]);
			if(results.length >= 15) { break; }
		}
		expect(results).toEqual([
			[1, { 1: 1 }],
			[2, { 2: 1 }],
			[3, { 3: 1 }],
			[4, { 2: 2 }],
			[5, { 5: 1 }],
			[6, { 2: 1, 3: 1 }],
			[7, { 7: 1 }],
			[8, { 2: 3 }],
			[9, { 3: 2 }],
			[10, { 2: 1, 5: 1 }],
			[11, { 11: 1 }],
			[12, { 2: 2, 3: 1 }],
			[13, { 13: 1 }],
			[14, { 7: 1, 2: 1 }],
			[15, { 3: 1, 5: 1 }]
		]);
	}
]);
testing.testAll();

const DESIRED_SOLUTIONS = 4000000;
const DESIRED_SQUARE_DIVISORS = (DESIRED_SOLUTIONS - 1) / 2 + 1;
const solve = () => {
	for(const [integer, factorization] of factorizedIntegers()) {
		if(integer >= DESIRED_SOLUTIONS) {
			const factorizationOfSquare = factorization.mapKeys((k, v) => v * 2);
			const divisorsOfSquare = (
				Object.values(factorizationOfSquare)
				.map(v => v + 1)
				.reduce((a, c) => a * c)
			);
			if(divisorsOfSquare > DESIRED_SQUARE_DIVISORS) {
				console.log(`the answer is ${integer}`);
				return;
			}
			if(integer % 1000 === 0) {
				console.log(`progress: ${integer}`);
			}
		}
	}
};
