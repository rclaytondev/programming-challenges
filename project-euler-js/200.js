const isSqube = (number) => {
	const factorization = Math.factorize(number, "prime-exponents");
	const exponents = Object.values(factorization);
	return exponents.sort().equals([2, 3]);
};
testing.addUnit("isSqube()", isSqube, [
	[72, true],
	[200, true],

	[13, false],
	[25, false],
	[8, false],
	[64, false]
]);

const naiveSqubes = new Sequence(
	/* uses a naive brute-force algorithm to yield all squbes in order. */
	function*() {
		for(let i = 72; i < Infinity; i ++) {
			if(isSqube(i)) { yield i; }
		}
	}
);
const efficientSqubes = new Sequence(
	/* uses a more efficient algorithm to yield all squbes in ascending order. */
	function*() {
		const nextPrime = (prime => {
			for(let i = prime + 1; i < Infinity; i ++) {
				if(isPrime(i)) { return i; }
			}
		}).memoize(true);
		const getSqube = (factor1, factor2) => (factor1 ** 2) * (factor2 ** 3);
		const smallestKey = (map) => {
			let smallest = Infinity;
			for(const [key, value] of map) {
				if(key < smallest) { smallest = key; }
			}
			return smallest;
		};

		const squbeCandidates = new Map([
			[72, [3, 2]],
			[108, [2, 3]]
		]);
		const addSqubeCandidate = (factor1, factor2) => {
			if(factor1 !== factor2) {
				const value = getSqube(factor1, factor2);
				squbeCandidates.set(value, [factor1, factor2]);
			}
		};
		while(true) {
			const sqube = smallestKey(squbeCandidates);
			const factors = squbeCandidates.get(sqube);
			squbeCandidates.delete(sqube);
			yield sqube;

			addSqubeCandidate(nextPrime(factors[0]), factors[1]);
			addSqubeCandidate(factors[0], nextPrime(factors[1]));
		}
	}
);
testing.addUnit("efficientSqubes()", {
	"should return the same results as the naive sqube finder": () => {
		const correctValues = naiveSqubes.slice(0, 50);
		const actualValues = efficientSqubes.slice(0, 50);
		expect(correctValues).toEqual(actualValues);
	}
});

const isPrime = (number) => {
	for(let i = 2; i * i <= number; i ++) {
		if(number % i === 0) {
			return false;
		}
	}
	return true;
};
const numberFromDigits = (digits) => {
	let number = 0;
	digits.forEach((digit, index) => {
		number += digit * (10 ** (digits.length - index - 1));
	});
	return number;
};
const isPrimeProof = (number) => {
	const digits = number.digits();
	let index = 0;
	for(const digit of digits) {
		const digitsBefore = digits.slice(0, index);
		const digitsAfter = digits.slice(index + 1);
		for(let newDigit = 0; newDigit <= 9; newDigit ++) {
			if((newDigit !== 0 || index !== 0) && (newDigit !== digit)) {
				const newDigits = [...digitsBefore, newDigit, ...digitsAfter];
				const newNumber = numberFromDigits(newDigits);
				if(isPrime(newNumber)) {
					return false;
				}
			}
		}
		index ++;
	}
	return true;
};
testing.addUnit("isPrimeProof()", isPrimeProof, [
	[206, true],
	[1992008, true],

	[1200, false],
	[37, false]
]);

const plotSqubes = () => {
	let iterations = 0;
	for(const sqube of naiveSqubes) {
		const factors = Math.factorize(sqube);
		const prime1 = factors.find(v => factors.count(v) === 2);
		const prime2 = factors.find(v => factors.count(v) === 3);
		const index1 = Sequence.PRIMES.indexOf(prime1);
		const index2 = Sequence.PRIMES.indexOf(prime2);

		c.fillStyle = "darkslategray";
		c.strokeStyle = "darkslategray";
		c.font = "15px monospace";
		c.textAlign = "center";
		c.textBaseline = "middle";
		const SCALE = 100;
		const OFFSET = 100;
		const topLeftCorner = new Vector(
			OFFSET + index1 * SCALE - (SCALE / 2),
			OFFSET + index2 * SCALE - (SCALE / 2)
		);
		c.fillText(sqube, topLeftCorner.x + SCALE / 2, topLeftCorner.y + SCALE / 2);
		c.strokeRect(topLeftCorner.x, topLeftCorner.y, SCALE, SCALE);
		c.fillRect(topLeftCorner.x, topLeftCorner.y, SCALE / 5, SCALE / 5);
		c.fillStyle = "white";
		c.fillText(iterations, topLeftCorner.x + SCALE / 10, topLeftCorner.y + SCALE / 10);


		iterations ++;
		if(iterations > 100) { break; }
	}
};
const timeAlgorithm = (func, numTrials = 1) => {
	/* returns the number of milliseconds the function takes to execute. */
	const start = Date.now();
	for(let i = 0; i < numTrials; i ++) {
		func();
	}
	const end = Date.now();
	return (end - start) / numTrials;
};
const timesGreater = (v1, v2) => (Math.abs(v1 - v2)) / v1 + 1;
const compareSpeeds = (func1, func2, numTrials = 1) => {
	const time1 = timeAlgorithm(func1, numTrials);
	const time2 = timeAlgorithm(func2, numTrials);
	if(time1 > time2) {
		console.log(`Algorithm 2 is ${(time1 / time2).toFixed(2)} times faster.`);
	} else {
		console.log(`Algorithm 1 is ${(time2 / time1).toFixed(2)} times faster.`);
	}
};


const solve = (DESIRED_NUMBERS = 200) => {
	let numbersFound = 0;
	for(const sqube of efficientSqubes) {
		if(
			`${sqube}`.includes("200") &&
			isPrimeProof(sqube)
		) {
			console.log(`${sqube} meets the criteria! (${numbersFound + 1} of ${DESIRED_NUMBERS} found)`);
			numbersFound ++;
			if(numbersFound >= DESIRED_NUMBERS) {
				console.log(`the answer is ${sqube}!`);
				return sqube;
			}
		}
	}
};

console.time("solving");
solve(200);
console.timeEnd("solving");
