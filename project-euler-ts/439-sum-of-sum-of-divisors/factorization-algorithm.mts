import { MathUtils } from "../../utils-ts/modules/math/MathUtils.mjs";

export const factorizeAll = (upperBound: number) => {
	const factorizations: Map<number, Map<number, number>> = new Map();
	factorizations.set(1, new Map());
	const primesFound = [2];
	const search = (nextPrime: number) => {
		for(const [num, factorization] of new Map(factorizations)) {
			if(num * nextPrime > upperBound) { break; }
			for(let exponent = 1; num * nextPrime ** exponent <= upperBound; exponent ++) {
				const newFactorization = new Map(factorization);
				newFactorization.set(nextPrime, exponent);
				factorizations.set(num * nextPrime ** exponent, newFactorization);
			}
		}
	};
	while(primesFound[primesFound.length - 1] <= upperBound) {
		search(primesFound[primesFound.length - 1]);
		for(let i = primesFound[primesFound.length - 1] + 1; true; i ++) {
			if(!factorizations.has(i)) {
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
			// console.log(`sigma(${i * j}) = ${divisorSum(factorizations.get(i * j)!)}`);
			// debugger;
			sum += divisorSum(factorizations.get(i * j)!);
		}
	}
	return sum;
};

// console.time();
// console.log(divisorSumSum(1000));
// console.timeEnd();
// debugger;
