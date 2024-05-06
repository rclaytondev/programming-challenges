const isPrime = (number) => {
	if(number <= 1) { return false; }
	const sqrt = Math.sqrt(number);
	for(let i = 2; i < sqrt; i ++) {
		if(number % i === 0) {
			return false;
		}
	}
	return true;
};

const primesOfQuadratic = (a, b) => {
	for(let i = 0; i < Infinity; i ++) {
		const result = (i ** 2) + (a * i) + b;
		if(!isPrime(result)) {
			return i;
		}
	}
};

let mostPrimes = 0;
let product = 0;
for(let a = -999; a < 1000; a ++) {
	for(let b = -1000; b < 1000; b ++) {
		const primes = primesOfQuadratic(a, b);
		if(primes > mostPrimes) {
			mostPrimes = primes;
			product = a * b;
			console.log(`n^2 + ${a}n + ${b}`);
		}
	}
}
console.log(product);
