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
	const terms = fractalSequence.slice(0, numTerms);
	return terms.sum();
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
