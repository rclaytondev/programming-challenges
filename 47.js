const problem47 = {
	isPrime: (number) => {
		const upperBound = Math.sqrt(number);
		if(number % 2 === 0 && number !== 2) { return false; }
		for(let i = 3; i <= upperBound; i += 2) {
			if(number % i === 0) { return false; }
		}
		return true;
	},
	factorial: ((number) => {
		if(number <= 1) { return 1; }
		return problem47.factorial(number - 1) * number;
	}).memoize(true),
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

const solve2 = () => {
	for(let intList of allIntegerLists()) {

	}
};

testing.testAll();
