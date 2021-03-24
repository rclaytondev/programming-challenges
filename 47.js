const problem47 = {
	isPrime: (number) => {
		const upperBound = Math.sqrt(number);
		if(number % 2 === 0 && number !== 2) { return false; }
		for(let i = 3; i <= upperBound; i += 2) {
			if(number % i === 0) { return false; }
		}
		return true;
	},
	getNextPrime: ((number) => {
		for(let i = number + 1; i < Infinity; i ++) {
			if(problem47.isPrime(i)) {
				return i;
			}
		}
	}).memoize(true),
	primesBelow: (number => {
		const primes = [];
		let possiblePrimes = new Array(number - 2).fill().map((v, i) => i + 2);
		while(possiblePrimes.length > 0) {
			const prime = possiblePrimes[0];
			primes.push(prime);
			possiblePrimes = possiblePrimes.filter(p => p % prime !== 0);
		}
		return primes;
	}).memoize(true),
	factorial: ((number) => {
		if(number <= 1) { return 1; }
		return problem47.factorial(number - 1) * number;
	}).memoize(true),
	primeFactors: (number) => {
		for(let i = 2; i <= number / 2; i ++) {
			if(number % i === 0) {
				return [i, ...problem47.primeFactors(number / i)];
			}
		}
		return [number];
	},
	distinctPrimeFactors: (number) => {
		const factors = new Set();
		let upperBound = Math.sqrt(number);
		for(let i = 2; i <= upperBound; i ++) {
			if(number % i === 0) {
				if(problem47.isPrime(i)) { factors.add(i); }
				if(problem47.isPrime(number / i)) { factors.add(number / i); }
			}
		}
		return factors;
	},
	nthPermutation: (n, objects) => {
		if(objects.length === 0) { return []; }
		if(objects.length === 1) { return [objects[0]]; }

		const firstObject = objects[Math.floor(objects.length * (n / problem47.factorial(objects.length)))];
		return [
			firstObject,
			...problem47.nthPermutation(
				n - (objects.indexOf(firstObject) / objects.length * problem47.factorial(objects.length)),
				objects.filter(d => d !== firstObject)
			)
		];
	},
	permutationIndex: (objects, lexicalOrder) => {
		if(objects.length === 1) { return 0; }
		const firstObject = objects[0];
		return (
			lexicalOrder.indexOf(firstObject) * problem47.factorial(objects.length - 1)
			+
			problem47.permutationIndex(objects.slice(1), lexicalOrder.filter(v => v !== firstObject))
		);
	},
	nextPermutation: (objects, lexicalOrder) => {
		const index = problem47.permutationIndex(objects, lexicalOrder);
		return problem47.nthPermutation(index + 1, lexicalOrder);
	},
	allIntegerLists: function*(minLength = 1) {
		/*
		Yields all lists of integers of finite length longer than the minimum length provided.
		*/
		const DIGITS = new Set([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
		for(let length = minLength; length < Infinity; length ++) {
			for(const combination of Set.cartesianProductGenerator(...[DIGITS].repeat(length))) {
				for(const partition of combination.partitionGenerator()) {
					if(partition.every(subArray => subArray.length === 1 || subArray[0] !== 0)) {
						yield partition.map(subArray => Number.parseInt(subArray.join("")));
					}
				}
			}
		}
	},

	solve: () => {
		let iterations = 0;
		for(let a = 210; a < 1000; a ++, iterations ++) {
			const b = a + 1, c = a + 2, d = a + 3;
			if(problem47.distinctPrimeFactors(d).size !== 4) {
				a = d;
				continue;
			}
			if(problem47.distinctPrimeFactors(c).size !== 4) {
				a = c;
				continue;
			}
			if(problem47.distinctPrimeFactors(b).size !== 4) {
				a = b;
				continue;
			}
			if(problem47.distinctPrimeFactors(a).size !== 4) {
				continue;
			}
			console.log(`the answer is ${a}`);
			return a;
		}
	},
	solve2: () => {
		/*
		Numbers with four distinct prime factors (in order, I think):
		210 = 2 * 3 * 5 * 7

		*/
		let currentNumber = 27588;
		let numbersFound = [27588];
		while(true) {
			currentNumber = problem47.nextNumberWithFourFactors(currentNumber);
			numbersFound.push(currentNumber);
			if(numbersFound.isConsecutive()) {
				return numbersFound[0];
			}
			numbersFound = numbersFound.slice(-3);

			console.log(currentNumber);
		}
	},

	nextNumberWithFourFactors: (number) => {
		const primeFactors = problem47.primeFactors(number);
		const highestPrimeFactor = primeFactors.max();
		const primes = [
			...problem47.primesBelow(highestPrimeFactor + 1),
			problem47.getNextPrime(highestPrimeFactor)
		];
		const primeExponents = primes.map(p => primeFactors.count(p));
		const newPrimeExponents = primeExponents.map((exponent, index) => {
			const threeSmallestPrimes = primes.filter((p, i) => i !== index).slice(0, 3);
			const productOfSmallest = threeSmallestPrimes.reduce((a, c) => a * c);
			const prime = primes[index];
			let newExponent = 0;
			while(prime ** newExponent * productOfSmallest <= number) {
				newExponent ++;
			}
			return newExponent;
		})
		.map(maxExponent => new Array(maxExponent + 1).fill().map((v, i) => i))
		.map(array => new Set(array));
		console.log(newPrimeExponents.reduce((a, c) => a * c.size, 1));
		return;
		debugger;
		let result = null;
		const evalulate = (exponents) => primes.map((p, i) => p ** exponents[i]).reduce((a, c) => a * c);
		for(const combination of Set.cartesianProductGenerator(...newPrimeExponents))  {
			console.log(combination);
			const primeProduct = evalulate(combination);
			if(
				combination.count(v => v !== 0) === 4 &&
				primeProduct > number &&
				(result == null || primeProduct < result)
			) {
				result = primeProduct;
			}
		}
		return result;
	},
	numbersWithFourFactors: function*() {
		/*
		Yields all integers with four distinct prime factors, in order.
		*/
		let number = 210;
		while(true) {
			yield number;
			number = problem47.nextNumberWithFourFactors(number);
		}
	},
};

testing.addUnit("problem47.distinctPrimeFactors()", problem47.distinctPrimeFactors, [
	[10, new Set([2, 5])],
	[20, new Set([2, 5])],
	[30, new Set([2, 3, 5])],
	[19, new Set([])]
]);
testing.addUnit("problem47.permutationIndex()", [
	() => {
		const result = problem47.permutationIndex(
			["A", "B", "C"],
			["A", "B", "C"],
		);
		expect(result).toEqual(0);
	},
	() => {
		const result = problem47.permutationIndex(
			["A", "C", "B"],
			["A", "B", "C"],
		);
		expect(result).toEqual(1);
	},
	() => {
		const result = problem47.permutationIndex(
			["B", "A", "C"],
			["A", "B", "C"],
		);
		expect(result).toEqual(2);
	},
	() => {
		const result = problem47.permutationIndex(
			["B", "C", "A"],
			["A", "B", "C"],
		);
		expect(result).toEqual(3);
	},
]);
testing.addUnit("problem47.nextPermutation()", [
	() => {
		const result = problem47.nextPermutation(
			["A", "B", "C"],
			["A", "B", "C"]
		);
		expect(result).toEqual(["A", "C", "B"]);
	},
	() => {
		const result = problem47.nextPermutation(
			["B", "C", "A"],
			["A", "B", "C"]
		);
		expect(result).toEqual(["C", "A", "B"]);
	}
]);
testing.addUnit("problem47.primeFactors()", [
	problem47.primeFactors,
	[10, [2, 5]],
	[105, [3, 5, 7]],
	[19, [19]],
	[16, [2, 2, 2, 2]],
	[24, [2, 2, 2, 3]]
]);
testing.addUnit("problem47.nextNumberWithFourFactors()", [
	problem47.nextNumberWithFourFactors,
	[210, 330],
	[330, 390],
	[390, 420],
	[420, 462]
]);


console.time("solving the problem");
console.log(problem47.solve2());
console.timeEnd("solving the problem");
