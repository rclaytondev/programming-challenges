import { MathUtils } from "../../utils-ts/modules/math/MathUtils.mjs";
import { CountLogger } from "../project-specific-utilities/CountLogger.mjs";

const isPrime = (num: number, primesBelow: number[]) => {
	if(num === 1) { return false; }
	for(const prime of primesBelow) {
		if(num % prime === 0) { return false; }
		if(prime ** 2 > num) { return true; }
	}
	return true;
};

const naivePrimesBelow = (upperBound: number) => {
	let primes = [2, 3];
	for(let i = 0; 6 * i + 1 <= upperBound; i ++) {
		if(6 * i + 1 <= upperBound && isPrime(6 * i + 1, primes)) {
			primes.push(6 * i + 1);
		}
		if(6 * i + 5 <= upperBound && isPrime(6 * i + 5, primes)) {
			primes.push(6 * i + 5);
		}
	}
	return primes;
};

export const primesBelow = (upperBound: number) => {
	/* Implements the Sieve of Eratosthenes. */
	const possiblePrimes = new Set();
	for(let i = 2; i <= upperBound; i ++) {
		possiblePrimes.add(i);
	}
	const primes = [];
	let prime = 2;
	mainLoop: while(true) {
		possiblePrimes.delete(prime);
		primes.push(prime);
		for(let multiple = prime ** 2; multiple <= upperBound; multiple += prime) {
			possiblePrimes.delete(multiple);
		}
		for(let i = prime + 1; i <= upperBound; i ++) {
			if(possiblePrimes.has(i)) {
				prime = i;
				continue mainLoop;
			}
		}
		return primes;
	}
};

const largestIdempotent = (modulo: number) => {
	if(MathUtils.isPrime(modulo)) {
		return 1;
	}
	for(let i = modulo - 1; i > 1; i --) {
		if((i ** 2) % modulo === i) {
			return i;
		}
	}
	return 1;
};

const solve = (upperBound: number) => {
	const logger = new CountLogger(n => 1000 * n, upperBound);
	let sum = 0;
	for(let m = 1; m <= upperBound; m ++) {
		logger.count();
		sum +=  largestIdempotent(m);
	}
	return sum;
};

// console.time();
// console.log(solve(100_000));
// console.timeEnd();
// debugger;


const input = 10_000_000;

console.time("trial division");
naivePrimesBelow(input);
console.timeEnd("trial division");

console.time("sieve of eratosthenes");
primesBelow(input);
console.timeEnd("sieve of eratosthenes");
debugger;
