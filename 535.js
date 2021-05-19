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

	const sequentialTerms = sequentialTermsBelow(numTerms);
	const fractalTerms = numTerms - sequentialTerms;

	const sumOfSequentials = (sequentialTerms) * (sequentialTerms + 1) / 2;
	const sumOfFractals = fractalSequenceSum(fractalTerms);
	return sumOfSequentials + sumOfFractals;
};

testing.addUnit("fractalSequenceSum()", {
	"returns the correct result for 1 term": () => {
		const sum = fractalSequenceSum(1);
		expect(sum).toEqual(1);
	},
	"returns the correct result for 20 terms": () => {
		const sum = fractalSequenceSum(20);
		expect(sum).toEqual(86);
	},
	"returns the correct result for 1000 terms": () => {
		const sum = fractalSequenceSum(1000);
		expect(sum).toEqual(364089);
	}
});

const sequentialTermsBelow = (numTerms) => {
	/* Returns the number of sequential terms whose one-based
	indices are less than or equal to the given number of terms. */
	let totalTerms = 0;
	let sequentialTerms = 0;
	for(const term of fractalSequence) {
		const sqrt = flooredSqrt(term);
		if(totalTerms + sqrt >= numTerms) {
			return sequentialTerms + (numTerms - totalTerms);
		}
		totalTerms += sqrt + 1;
		sequentialTerms += sqrt;
	}
};
testing.addUnit("sequentialTermsBelow()", sequentialTermsBelow, [
	[1, 1],
	[2, 1],
	[3, 2],
	[4, 2],
	[5, 3],
	[6, 3],
	[7, 4],
	[8, 4],
	[9, 5],
	[10, 5],
	[11, 6],
	[12, 6],
	[13, 7],
	[14, 8],
	[15, 8],
	[16, 9],
	[17, 9],
	[18, 10],
	[19, 11],
	[20, 11]
]);
