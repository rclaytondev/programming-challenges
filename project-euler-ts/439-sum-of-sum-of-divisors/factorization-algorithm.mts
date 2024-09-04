import { MathUtils } from "../../utils-ts/modules/math/MathUtils.mjs";

export const factorizeAll = (upperBound: number) => {
	const factorizations: Map<number, number>[] = [new Map(), new Map()];
	const primesFound = [2];
	const search = (nextPrime: number) => {
		for(const [num, factorization] of [...factorizations].entries()) {
			if(num === 0 || !factorization) { continue; }
			if(num * nextPrime > upperBound) { break; }
			for(let exponent = 1; num * nextPrime ** exponent <= upperBound; exponent ++) {
				const newFactorization = new Map(factorization);
				newFactorization.set(nextPrime, exponent);
				factorizations[num * nextPrime ** exponent] = newFactorization;
			}
		}
	};
	while(primesFound[primesFound.length - 1] <= upperBound) {
		search(primesFound[primesFound.length - 1]);
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

// console.time();
// console.log(divisorSumSum(1000));
// console.timeEnd();
// debugger;
