const fractalSequence = new Sequence(function*() {
	const terms = [];
	let highest = 0;
	while(true) {
		const nextFractalTerm = terms[0] ?? 1;
		const numSequentialTerms = flooredSqrt(nextFractalTerm);
		for(let i = 0; i < numSequentialTerms; i ++) {
			yield highest + 1;
			terms.push(highest + 1);
			highest ++;
		}
		yield nextFractalTerm;
		terms.push(nextFractalTerm);
		terms.splice(0, 1);
	}
});

const flooredSqrt = (number) => {
	let i;
	for(i = 1; i * i <= number; i ++) { }
	return i - 1;
};

testing.addUnit("fractalSequence", {
	"correctly generates the terms of the sequence": () => {
		const terms = fractalSequence.slice(0, 10);
		expect(terms).toEqual([1, 1, 2, 1, 3, 2, 4, 1, 5, 3]);
	}
});

const fractalSequenceSum = (numTerms) => {
	if(numTerms <= 2) { return numTerms; }

	numTerms = BigInt(numTerms);
	const sequentialTerms = sequentialTermsBelow(numTerms);
	const fractalTerms = numTerms - sequentialTerms;

	const sumOfSequentials = (sequentialTerms) * (sequentialTerms + 1n) / 2n;
	const sumOfFractals = fractalSequenceSum(fractalTerms);
	return sumOfSequentials + sumOfFractals;
};

testing.addUnit("fractalSequenceSum()", {
	"returns the correct result for 1 term": () => {
		const sum = fractalSequenceSum(1n);
		expect(sum).toEqual(1n);
	},
	"returns the correct result for 20 terms": () => {
		const sum = fractalSequenceSum(20n);
		expect(sum).toEqual(86n);
	},
	"returns the correct result for 1000 terms": () => {
		const sum = fractalSequenceSum(1000n);
		expect(sum).toEqual(364089n);
	}
});

const sequentialTermsBelow = (numTerms) => {
	/* Returns the number of sequential terms whose one-based
	indices are less than or equal to the given number of terms. */
	let totalTerms = 0n;
	let sequentialTerms = 0n;
	for(const term of fractalSequence) {
		const sqrt = BigInt(flooredSqrt(term));
		if(totalTerms + sqrt >= numTerms) {
			return sequentialTerms + (numTerms - totalTerms);
		}
		totalTerms += sqrt + 1n;
		sequentialTerms += sqrt;
	}
};
testing.addUnit("sequentialTermsBelow()", sequentialTermsBelow, [
	[1n, 1n],
	[2n, 1n],
	[3n, 2n],
	[4n, 2n],
	[5n, 3n],
	[6n, 3n],
	[7n, 4n],
	[8n, 4n],
	[9n, 5n],
	[10n, 5n],
	[11n, 6n],
	[12n, 6n],
	[13n, 7n],
	[14n, 8n],
	[15n, 8n],
	[16n, 9n],
	[17n, 9n],
	[18n, 10n],
	[19n, 11n],
	[20n, 11n]
]);

const termsFrom = (termLimit) => {
	termLimit = BigInt(termLimit);
	if(termLimit <= 6) {
		return {
			sequential: termLimit,
			fractal: termLimit,
			total: 2n * termLimit
		};
	}

	const sequentialTerms = sequentialTermsBelow(termLimit);
	const sequentialsFromSequentials = sumOfSqrts(sequentialTerms);
	const {
		sequential: sequentialsFromFractals,
		total: totalFromFractals
	} = termsFrom(termLimit - sequentialTerms);

	const totalFromSequentials = sequentialsFromSequentials + sequentialTerms;
	const total = totalFromFractals + totalFromSequentials;

	const sequential = sequentialsFromSequentials + sequentialsFromFractals;
	const fractal = total - sequential;
	return { sequential, fractal, total };
};
testing.addUnit("termsFrom()", termsFrom, [
	[0, { sequential: 0n, fractal: 0n, total: 0n }],
	[1, { sequential: 1n, fractal: 1n, total: 2n }],
	[2, { sequential: 2n, fractal: 2n, total: 4n }],
	[3, { sequential: 3n, fractal: 3n, total: 6n }],
	[4, { sequential: 4n, fractal: 4n, total: 8n }],
	[5, { sequential: 5n, fractal: 5n, total: 10n }],
	[6, { sequential: 6n, fractal: 6n, total: 12n }],
	[7, { sequential: 8n, fractal: 7n, total: 15n }],
	[8, { sequential: 9n, fractal: 8n, total: 17n }],
	[9, { sequential: 11n, fractal: 9n, total: 20n }],
]);

const inefficientSumOfSqrts = (limit) => {
	let sum = 0;
	for(let i = 1; i <= limit; i ++) {
		sum += Math.floor(Math.sqrt(i))
	}
	return sum;
};
const sumOfSqrts = (limit) => {
	limit = BigInt(limit);
	let sum = 0n;
	let i;
	for(i = 0n; (i + 1n) ** 2n <= limit; i ++) {
		sum += i * (2n * i + 1n);
	}
	sum += i * (limit - i ** 2n + 1n);
	return sum;
};
testing.addUnit("sumOfSqrts()", sumOfSqrts, [
	[0, 0n],
	[1, 1n],
	[2, 2n],
	[3, 3n],
	[4, 5n],
	[5, 7n],
	[6, 9n],
	[7, 11n],
	[8, 13n],
	[9, 16n],
	[10, 19n]
]);
