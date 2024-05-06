const testConjecture = (maxSize) => {
	for(let size = 1; size <= maxSize; size ++) {
		for(let numOnes = 0; numOnes <= size ** 2; numOnes ++) {
			const complexity = minComplexity(size, numOnes);
			if(complexity === 4) {
				console.log(`%cFound a counterexample: c(${size}, ${numOnes}) = 4.`);
				return;
			}
		}
	}
	console.log(`No counterexamples found.`);
};
