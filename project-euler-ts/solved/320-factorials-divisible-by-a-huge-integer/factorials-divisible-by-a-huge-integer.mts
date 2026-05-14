import { Factorization } from "../../../utils-ts/modules/math/Factorization.mjs";
import { Sequence } from "../../../utils-ts/modules/math/Sequence.mjs";
import { Utils } from "../../../utils-ts/modules/Utils.mjs";

const compareExponentInFactorial = (num: bigint, prime: bigint, targetExponent: bigint) => {
	/*
	Returns 1 if the exponent on `prime` in `num`! is greater than `targetExponent`, 0 if they are equal, and -1 otherwise.
	*/
	let exponent = 0n;
	let primePower = prime;
	while(primePower <= num) {
		exponent += (num / primePower);
		if(exponent > targetExponent) { return 1n; }
		primePower *= prime;
	}
	if(exponent >= targetExponent) {
		return (exponent === targetExponent) ? 0n : 1n;
	}
	return -1n;
};

export const minDivisible = (prime: number, exponent: number, lowerBound: bigint = 1n): bigint => {
	/*
	Returns the smallest n such that n! is divisible by `prime` ** `exponent`.
	*/
	return Utils.binarySearch(
		lowerBound,
		BigInt(prime) * BigInt(exponent),
		(n: bigint) => compareExponentInFactorial(n, BigInt(prime), BigInt(exponent)),
		"first",
		"after",
	);
};

export const smallestFactorialDivisible = (base: number, exponent: number, lowerBound: bigint = 1n, primes: number[] = [...Sequence.PRIMES.termsBelow(base)]) => {
	let biggest = lowerBound;
	for(const prime of primes) {
		if(prime > base) { break; }
		const targetExponent = Factorization.exponentInFactorial(base, prime) * exponent;
		if(compareExponentInFactorial(biggest, BigInt(prime), BigInt(targetExponent)) < 0) {
			biggest = minDivisible(prime, targetExponent, biggest + 1n);
		}
	}
	return biggest;
};

export const factorialDivisibilitySum = (baseMin: number = 10, baseMax: number = 1_000_000, exponent: number = 1234567890) => {
	const primes = [...Sequence.PRIMES.termsBelow(baseMax)];
	let sum = 0n;
	let last = 1n;
	for(let i = baseMin; i <= baseMax; i ++) {
		const primeDivisors = [];
		for(const prime of primes) {
			if(i % prime === 0) {
				primeDivisors.push(prime);
			}
			if(prime > i) { break; }
		}
		last = smallestFactorialDivisible(i, exponent, last, primeDivisors);
		sum += last;
	}
	return sum;
};

// console.time();
// console.log(factorialDivisibilitySum(10, 1_000_000));
// console.timeEnd();
// debugger;
