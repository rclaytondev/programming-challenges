import { MathUtils } from "../../utils-ts/modules/math/MathUtils.mjs";

export const factorizeAll = (upperBound: number) => {
	const factorizations: Map<number, number>[] = [new Map()];
	const primesFound = [2];
	const search = (factorization: Map<number, number>, num: number, numPrimes: number) => {
		factorizations[num] = factorization;
		if(numPrimes >= primesFound.length) { return; }
		const nextPrime = primesFound[numPrimes];
		const firstExponent = (numPrimes === primesFound.length - 1) ? 1 : 0;
		for(let exponent = firstExponent; num * nextPrime ** exponent <= upperBound; exponent ++) {
			const factorizationCopy = new Map(factorization);
			if(exponent !== 0) {
				factorizationCopy.set(nextPrime, exponent);
			}
			search(factorizationCopy, num * nextPrime ** exponent, numPrimes + 1);
		}
	};
	while(primesFound[primesFound.length - 1] <= upperBound) {
		search(new Map(), 1, 0);
		for(let i = primesFound[primesFound.length - 1] + 1; true; i ++) {
			if(!factorizations[i]) {
				primesFound.push(i);
				break;
			}
		}
	}
	return factorizations;
};

const divisorSum = (factorization: Map<number, number>) => (
	MathUtils.product([...factorization].map(([prime, exponent]) => (prime ** (exponent + 1) - 1) / (prime - 1)))
);

export const divisorSumSum = (upperBound: number) => {
	const factorizations = factorizeAll(upperBound ** 2);
	let sum = 0;
	for(let i = 1; i <= upperBound; i ++) {
		for(let j = 1; j <= upperBound; j ++) {
			sum += divisorSum(factorizations[i * j]);
		}
	}
	return sum;
};
