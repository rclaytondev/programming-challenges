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
