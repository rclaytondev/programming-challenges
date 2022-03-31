const numFromDigits = (digits) => digits.map((digit, i) => digit * 10 ** (digits.length - i - 1)).sum();

const solve = (numPrimes) => {
	for(let prime of Sequence.PRIMES) {
		const digits = prime.digits();
		const digitSubsets = new Set(new Array(digits.length).fill().map((v, i) => i)).subsets();
		for(const subset of digitSubsets) {
			if(subset.size === 0) { continue; }
			let actualNumPrimes = 0;
			for(let replacementDigit = 0; replacementDigit < 10; replacementDigit ++) {
				if(replacementDigit === 0 && subset.has(0)) { continue; }
				const replacementDigits = [...digits];
				for(const index of subset) {
					replacementDigits[index] = replacementDigit;
				}
				const newNumber = numFromDigits(replacementDigits);
				if(Math.isPrime(newNumber)) {
					actualNumPrimes ++;
				}
			}
			if(actualNumPrimes === numPrimes) {
				return prime; // doesn't actually return the answer
			}
		}
	}
};
testing.addUnit(solve, [
	[7, 56003]
]);
