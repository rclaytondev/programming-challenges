Math.totient = (n) => {
	let exponentOn2 = 0;
	while(n % 2 === 0) {
		n /= 2;
		exponentOn2 ++;
	}
	let result = (exponentOn2 === 0) ? 1 : 2 ** (exponentOn2 - 1);
	for(let i = 3; i * i <= n; i ++) {
		let exponent = 0;
		while(n % i === 0) {
			n /= i;
			exponent ++;
		}
		result *= (exponent === 0) ? 1 : (i ** (exponent - 1)) * (i - 1);
	}
	if(n !== 1) { result *= (n - 1); }
	return result;
};

const exponentIn = (n, p) => {
	let result = 0;
	while(n % p === 0) {
		result ++;
		n /= p;
	}
	return result;
};

const inverseTotient = (n) => {
	/* returns the list of all integers k such that totient(k) = n. */
	// phi(p^n) = p^n - p^(n-1) = p^(n-1)(p-1).
	let primes = [];
	for(const divisor of Math.divisors(n)) {
		if(Math.isPrime(divisor + 1) && exponentIn(n / divisor, divisor + 1) + 1 > 0) {
			const prime = divisor + 1;
			primes.push({ prime: prime, maxExponent: exponentIn(n / divisor, prime) + 1 });
		}
	}
	// primes = [...]
	let result = [];
	for(const { factorization, product } of Tree.iterate({ factorization: {}, product: 1 }, function*({ factorization, product }) {
		if(Object.keys(factorization).length === primes.length) { return; }
		const { prime, maxExponent } = primes[Object.keys(factorization).length];
		yield ({
			factorization: { ...factorization, [prime]: 0 },
			product: product
		});
		for(let exponent = 1; exponent <= maxExponent; exponent ++) {
			const newProduct = product * (prime ** (exponent - 1)) * (prime - 1);
			if(n % newProduct === 0) {
				yield {
					factorization: { ...factorization, [prime]: exponent },
					product: newProduct
				};
			}
			else { break; }
		}
	}, true)) {
		if(product === n) {
			result.push(Math.defactorize(factorization));
		}
	}
	return result.sort(Array.SORT_ASCENDING);
};
testing.addUnit("inverseTotient()", inverseTotient, [
	[4, [5, 8, 10, 12]],
	[6, [7, 9, 14, 18]]
]);

const totientChains = (upperBound = 4e7, chainLength = 25) => {
	/* returns all numbers below the upper bound that produce a chain of the given length ending at 1. */
	if(chainLength === 1) {
		return [1];
	}
	let result = [];
	for(const secondNumber of totientChains(upperBound, chainLength - 1)) {
		for(const firstNumber of inverseTotient(secondNumber)) {
			if(firstNumber > secondNumber && firstNumber < upperBound) {
				result.push(firstNumber);
			}
		}
	}
	return result.sort(Array.SORT_ASCENDING);
};
testing.addUnit("totientChains()", totientChains, [
	[100, 2, [2]],
	[100, 4, [5, 7, 8, 9, 10, 12, 14, 18]]
]);

const solve = (upperBound = 4e7, chainLength = 25) => {
	let sum = 0;
	for(const num of totientChains(upperBound - 1, chainLength - 1)) {
		if(Math.isPrime(num + 1)) {
			sum += num + 1;
		}
	}
	return sum;
};
testing.addUnit("solve()", solve, [
	[100, 4, 12]
]);

console.time();
solve(4e7, 13);
console.timeEnd();
