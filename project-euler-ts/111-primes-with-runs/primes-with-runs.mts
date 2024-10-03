import { MathUtils } from "../../utils-ts/modules/math/MathUtils.mjs";
import { Utils } from "../../utils-ts/modules/Utils.mjs";

export const constructNumber = (digit: number, positions: Set<number>, otherDigits: number[]) => {
	const resultDigits = [];
	let index = 0;
	for(let i = 0; i < positions.size + otherDigits.length; i ++) {
		if(positions.has(i)) {
			resultDigits.push(digit);
		}
		else {
			resultDigits.push(otherDigits[index]);
			index ++;
		}
	}
	if(resultDigits[0] === 0) {
		return null;
	}
	return MathUtils.fromDigits(resultDigits);
};

export const primeSumMaxDigits = (numDigits: number, digit: number) => {
	const otherDigits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter(d => d !== digit);
	for(let occurrences = numDigits; occurrences >= 0; occurrences --) {
		const primes = [];
		for(const positions of Utils.subsets(Utils.range(0, numDigits - 1), occurrences)) {
			for(const digitCombination of Utils.cartesianPower(otherDigits, numDigits - occurrences)) {
				const possiblePrime = constructNumber(digit, positions, digitCombination);
				if(possiblePrime !== null && MathUtils.isPrime(possiblePrime)) {
					primes.push(possiblePrime);
				}
			}
		}
		if(primes.length !== 0) {
			return MathUtils.sum(primes);
		}
	}
	throw new Error(`Unexpected: did not find any ${numDigits}-digits prime numbers.`);
};

export const solve = (numDigits: number = 10) =>  {
	let sum = 0;
	for(let digit = 0; digit <= 9; digit ++) {
		sum += primeSumMaxDigits(numDigits, digit);
	}
	return sum;
};

// console.time();
// console.log(solve(10));
// console.timeEnd();
// debugger;
