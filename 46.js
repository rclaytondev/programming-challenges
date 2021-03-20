const isPrime = (number) => {
	const upperBound = Math.sqrt(number);
	if(number % 2 === 0) { return false; }
	for(let i = 3; i <= upperBound; i += 2) {
		if(number % i === 0) { return false; }
	}
	return true;
};
const isComposite = (number) => !isPrime(number);
const getNextPrime = ((number) => {
	for(let i = number + 1; i < Infinity; i ++) {
		if(isPrime(i)) {
			return i;
		}
	}
}).memoize(true);


const solve = () => {
	/* Returns the answer. */
	let doubleSquares = [2];
	let primes = [2, 3];
	for(let i = 3; i < Infinity; i += 2) {
		const lastSquare = doubleSquares.lastItem() / 2;
		const nextSquare = (Math.sqrt(lastSquare) + 1) ** 2;
		if(nextSquare * 2 < i) { doubleSquares.push(nextSquare * 2); }
		const nextPrime = getNextPrime(primes.lastItem());
		if(nextPrime < i) { primes.push(nextPrime); }
		if(isComposite(i)) {
			let canBeExpressedAsSum = false;
			primeLoop: for(let j = 0; j < primes.length; j ++) {
				const prime = primes[j];
				for(let k = 0; k < doubleSquares.length; k ++) {
					const doubleSquare = doubleSquares[k];
					if(prime + doubleSquare === i) {
						console.log(`${i} = ${prime} + 2 * ${doubleSquare / 2}`);
						canBeExpressedAsSum = true;
						break primeLoop;
					}
				}
			}
			if(!canBeExpressedAsSum) {
				return i;
			}
		}
	}
};
