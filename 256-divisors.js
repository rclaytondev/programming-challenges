const numDivisors = (n) => {
	let divisors = 0;
	for(let i = 1; i * i <= n; i ++) {
		if(n % i === 0) {
			divisors += (i * i === n) ? 1 : 2;
		}
	}
	return divisors;
};

const numbersWithFactorization = (exponents) => new Sequence(
	/*
	For a list of exponents [e1, e2, e3, ...], this function returns a Sequence
	containing all numbers that are of the form a^e1 * b^e2 * c^e3 * ... for
	every combination of primes [a, b, c, ...].
	The Sequence will contain the numbers in ascending order.
	*/
	function* numbersWithFactorization() {
		exponents = exponents.sort((a, b) => a - b);
		let primes = Sequence.PRIMES.slice(0, exponents.length).reverse();
		let number = primes.map((p, i) => p ** exponents[i]).product();
		while(true) {
			yield number;
			[number, primes] = nextNumberWithFactorization(exponents, primes, number);
		}
	},
	{ isMonotonic: true }
).set("isIncreasing", () => true);
testing.addUnit("numbersWithFactorization()", [
	() => {
		const numbers = numbersWithFactorization([4]).slice(0, 10);
		expect(numbers).toEqual([
			// sequence of fourth powers of primes (2^4, 3^4, 5^4, etc...)
			16, 81, 625, 2401, 14641, 28561, 83521, 130321, 279841, 707281
		]);
	},
	() => {
		const numbers = numbersWithFactorization([2, 3]).slice(0, 10);
		expect(numbers).toEqual(
			// numbers that are of the form a^2 * b^3 for distinct primes a and b
			[72, 108, 200, 392, 500, 675, 968, 1125, 1323, 1352]
		);
	},
	() => {
		const numbers = numbersWithFactorization([1, 1, 1, 4, 4]).slice(0, 10);
		expect(numbers).toEqual(
			[498960, 589680, 771120, 861840, 926640, 1043280, 1211760, 1297296, 1315440, 1354320]
		);
	}
]);

const nextNumberWithFactorization = (exponents, primes, number) => {
	let smallestUsablePrime = Infinity;
	for(const prime of primes) {
		const nextPrime = Sequence.PRIMES.nextTerm(prime);
		if(!primes.includes(nextPrime) && prime < smallestUsablePrime) {
			smallestUsablePrime = prime;
		}
	}
	const upperBoundPrimes = primes.map(p => p === smallestUsablePrime ? Sequence.PRIMES.nextTerm(p) : p);
	const upperBound = upperBoundPrimes.map((p, i) => p ** exponents[i]).product();
	let smallestAnswer = upperBound;
	let smallestAnswerPrimes = upperBoundPrimes;
	const nextPrimes = function*(incompletePrimes) {
		if(incompletePrimes.length >= exponents.length) { return; }
		const partialProduct = incompletePrimes.map((p, i) => p ** exponents[i]).product();
		const exponentsLeft = exponents.slice(incompletePrimes.length);
		const smallestNotInPrimes = Sequence.PRIMES.find(p => !incompletePrimes.includes(p));
		for(const prime of Sequence.PRIMES) {
			const newPartialProduct = partialProduct * (prime ** exponents[incompletePrimes.length]);
			if(incompletePrimes.includes(prime)) { continue; }
			if(prime > smallestAnswer / (smallestNotInPrimes ** exponentsLeft.sum())) { break; }
			if(newPartialProduct > smallestAnswer) { break; }
			yield [...incompletePrimes, prime];
		}
	};
	for(const primeCombination of Tree.iterate([], nextPrimes, true)) {
		if(primeCombination.length === exponents.length) {
			const possibleAnswer = primeCombination.map((p, i) => p ** exponents[i]).product();
			if(possibleAnswer > number && possibleAnswer < smallestAnswer) {
				smallestAnswer = possibleAnswer;
				smallestAnswerPrimes = primeCombination;
			}
		}
	}
	return [smallestAnswer, smallestAnswerPrimes];
};

testing.addUnit("nextNumberWithFactorization()", [
	() => {
		const result = nextNumberWithFactorization(
			[1, 2, 3],
			[11, 3, 2],
			792
		);
		expect(result).toEqual([936, [13, 3, 2]]);
	}
]);

const numbersWithNDivisors = (numDivisors) => {
	const productArrays = waysToExpressAsProduct(numDivisors);
	const generators = [];
	for(const productArray of productArrays) {
		const exponents = productArray.map(n => n - 1);
		generators.push(numbersWithFactorization(exponents));
	}
	return Sequence.union(...generators);
};
testing.addUnit("numbersWithNDivisors()", [
	d => numbersWithNDivisors(d).slice(0, 10),
	[2, [2, 3, 5, 7, 11, 13, 17, 19, 23, 29]],
	[3, [4, 9, 25, 49, 121, 169, 289, 361, 529, 841]],
	[4, [6, 8, 10, 14, 15, 21, 22, 26, 27, 33]]
]);

const waysToExpressAsProduct = (number) => {
	const factors = Math.factorize(number);
	const permutations = factors.permutations();
	const waysToExpress = new Set([]);
	const waysStrings = new Set([]);
	for(const permutation of permutations) {
		for(const partition of permutation.partitionGenerator()) {
			let wayToExpress = [];
			for(const subsequence of partition) {
				wayToExpress.push(subsequence.product());
			}
			wayToExpress = wayToExpress.sort((a, b) => a - b);
			if(!waysStrings.has(wayToExpress.join(" "))) {
				waysToExpress.add(wayToExpress);
				waysStrings.add(wayToExpress.join(" "));
			}
		}
	}
	return waysToExpress;
};
testing.addUnit("waysToExpressAsProduct()", [
	() => {
		const ways = waysToExpressAsProduct(30);
		expect(ways).toEqual(new Set([
			[30],
			[2, 15],
			[3, 10],
			[5, 6],
			[2, 3, 5]
		]));
	}
]);

const leastWithAtLeastNDivisors = (minDivisors) => {
	const base2Logarithm = Math.ceil(Math.log2(minDivisors));
	const primes = Sequence.PRIMES.slice(0, base2Logarithm);
	const upperBound = primes.product();
	const maxExponents = primes.map(p => Math.floor(Math.logBase(p, upperBound)));
	let result = upperBound;
	const checkCombination = (exponents = [], product = 1) => {
		/* check all decreasing combinations of exponents in the valid ranges */
		if(exponents.length >= primes.length) {
			const numDivisors = exponents.map(e => e + 1).product();
			if(product < result && numDivisors >= minDivisors) {
				result = product;
			}
		}
		else {
			const lastExponent = exponents.lastItem() ?? Infinity;
			for(
				let nextExponent = 0;
				nextExponent <= Math.min(lastExponent, maxExponents[exponents.length]);
				nextExponent ++
			) {
				const newProduct = product * primes[exponents.length] ** nextExponent;
				if(newProduct > result) { return; }
				checkCombination([...exponents, nextExponent], newProduct);
			}
		}
	};
	checkCombination([], 1);
	return result;
};
testing.addUnit("leastWithAtLeastNDivisors()", [
	leastWithAtLeastNDivisors,
	[2, 2],
	[3, 4],
	[4, 6],
	[5, 12],
	[10, 48],
	[32, 840],
	[37, 1680],
	[48, 2520],
	[75, 15120],
	[100, 45360]
])

const numbersWithAtLeastNDivisors = (minDivisors, step = 10) => new Sequence(
	// non-naive implementation
	function* numbersWithAtLeastNDivisors() {
		const generators = [];
		const terms = [];
		for(let i = 0; i < step; i ++) {
			generators.push(numbersWithNDivisors(minDivisors + i).generator());
			terms.push(generators.lastItem().next().value);
		}
		let firstNotInSequences = leastWithAtLeastNDivisors(minDivisors + step);
		while(true) {
			const [nextTerm, sequenceIndex] = terms.min(null, null, "all");
			if(nextTerm > firstNotInSequences) {
				for(let i = 0; i <= step; i ++) {
					generators.push(
						numbersWithNDivisors(minDivisors + generators.length).generator()
					);
					terms[generators.length - 1] = generators.lastItem().next().value;
				}
				firstNotInSequences = leastWithAtLeastNDivisors(minDivisors + generators.length + 1);
			}
			else {
				yield nextTerm;
				terms[sequenceIndex] = generators[sequenceIndex].next().value;
			}
		}
	},
	{ isMonotonic: true }
).set("isIncreasing", () => true);
testing.addUnit("numbersWithAtLeastNDivisors", [
	n => numbersWithAtLeastNDivisors(n).slice(0, 10),
	[2, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11]],
	[3, [4, 6, 8, 9, 10, 12, 14, 15, 16, 18]],
	[4, [6, 8, 10, 12, 14, 15, 16, 18, 20, 21]],
	[11, [60, 72, 84, 90, 96, 108, 120, 126, 132, 140]],
	[20, [240, 336, 360, 420, 432, 480, 504, 528, 540, 560]],
	[100, [45360, 50400, 55440, 60480, 65520, 69300, 70560, 71280, 73920, 75600]]
]);

testing.testUnit("numbersWithFactorization()");
