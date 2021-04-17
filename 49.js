const solve = () => {
	for(const startValue of Sequence.PRIMES) {
		if(startValue >= 9999) { break; }
		if(startValue === 1487)  { continue; }

		for(let difference = 1; startValue + difference < 10000; difference ++) {
			const terms = [
				startValue,
				startValue + difference,
				startValue + (difference * 2)
			];
			if(
				terms.slice(1).every(Math.isPrime) &&
				terms.slice(1).every(term => term.digits().sort().equals(startValue.digits().sort()))
			) {
				return terms;
			}
		}
	}
};
