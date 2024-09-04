import { MathUtils } from "../../utils-ts/modules/math/MathUtils.mjs";
import { PriorityQueue } from "../../utils-ts/modules/PriorityQueue.mjs";

export const factorizeAll = (upperBound: number) => {
	const factorizations: Map<number, Map<number, number>> = new Map();
	const factorizedNumbers = new PriorityQueue<number>();
	factorizations.set(1, new Map());
	factorizedNumbers.insert(1, 1);
	const primesFound = [2];
	while(primesFound[primesFound.length - 1] <= upperBound) {
		const nextPrime = primesFound[primesFound.length - 1];
		let newFactorizations = new Map<number, Map<number, number>>();
		for(const [num] of factorizedNumbers.entries()) {
			const factorization = factorizations.get(num);
			if(num * nextPrime > upperBound) { break; }
			for(let exponent = 1; num * nextPrime ** exponent <= upperBound; exponent ++) {
				const newFactorization = new Map(factorization);
				newFactorization.set(nextPrime, exponent);
				newFactorizations.set(num * nextPrime ** exponent, newFactorization);
			}
		}
		for(const num of newFactorizations.keys()) {
			factorizedNumbers.insert(num, num);
			factorizations.set(num, newFactorizations.get(num)!);
		}
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
		for(let j = 1; j <= i; j ++) {
			// console.log(`sigma(${i * j}) = ${divisorSum(factorizations.get(i * j)!)}`);
			// debugger;
			sum += divisorSum(factorizations.get(i * j)!) * (j === i ? 1 : 2);
		}
	}
	return sum;
};

// console.time();
// console.log(divisorSumSum(2000));
// console.timeEnd();
// debugger;
