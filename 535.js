const fractalSequence = new Sequence(function*() {
	const terms = [];
	let highest = 0;
	let numFractalTerms = 0;
	while(true) {
		const nextFractalTerm = terms[numFractalTerms] ?? 1;
		const numSequentialTerms = Math.floor(Math.sqrt(nextFractalTerm));
		for(let i = 0; i < numSequentialTerms; i ++) {
			yield highest + 1;
			terms.push(highest + 1);
			highest ++;
		}
		yield nextFractalTerm;
		terms.push(nextFractalTerm);
		numFractalTerms ++;
	}
});

testing.addUnit("fractalSequence", {
	"correctly generates the terms of the sequence": () => {
		const terms = fractalSequence.slice(0, 10);
		expect(terms).toEqual([1, 1, 2, 1, 3, 2, 4, 1, 5, 3]);
	}
});
