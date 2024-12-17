import { MathUtils } from "../../utils-ts/modules/math/MathUtils.mjs";
import { Sequence } from "../../utils-ts/modules/math/Sequence.mjs";
import { Utils } from "../../utils-ts/modules/Utils.mjs";

export class TauNumbers {
	static productPartitions(num: number, upperBound: number = Infinity) {
		if(num <= 1) { return [[]]; }
		let result: number[][] = [];
		for(const divisor of MathUtils.divisors(num)) {
			if(divisor > 1 && divisor <= upperBound) {
				const partitions = TauNumbers.productPartitions(num / divisor, divisor);
				result = [...result, ...partitions.map(p => [divisor, ...p])];
			}
		}
		return result;
	}

	static minWithDivisors = Utils.memoize((numDivisors: number, primesToAvoid: number[]) => {
		let minimum = Infinity;
		for(const partition of TauNumbers.productPartitions(numDivisors)) {
			const unusedPrimes = Sequence.PRIMES.filter(p => !primesToAvoid.includes(p)).slice(0, partition.length);
			minimum = Math.min(
				minimum,
				MathUtils.unfactorize(unusedPrimes, partition.map(p => p - 1))
			);
		}
		return minimum;
	});

	static minTauNumberSearch = Utils.memoize((primes: number[], minExponents: number[], exponentsChosen: number, numDivisors: number) => {
		if(minExponents.length === 0) {
			return TauNumbers.minWithDivisors(numDivisors, primes);
		}
		else {
			const nextTerms = MathUtils.divisors(numDivisors);
			let minimum = Infinity;
			for(let i = nextTerms.length - 1; i >= 0; i --) {
				if(nextTerms[i] - 1 < minExponents[0]) { break; }
				minimum = Math.min(
					minimum,
					primes[exponentsChosen] ** (nextTerms[i] - 1) * TauNumbers.minTauNumberSearch(primes, minExponents.slice(1), exponentsChosen + 1, numDivisors / nextTerms[i])
				);
			}
			return minimum;
		}
	});
	static minTauNumber(numDivisors: number) {
		const factorization = MathUtils.factorize(numDivisors);
		const primes = [...factorization.keys()];
		return TauNumbers.minTauNumberSearch(
			primes,
			primes.map(p => factorization.get(p)!),
			0,
			numDivisors
		);
	}

	static tauSum(upperBound: number) {
		const maxDivisors = 2 * Math.sqrt(upperBound) - 1;
		let result = 0;
		for(let i = 1; i <= maxDivisors; i ++) {
			const tauNumber = TauNumbers.minTauNumber(i);
			if(tauNumber <= upperBound) {
				result += tauNumber;
			}
		}
		return result;
	}
}


console.time();
console.log(TauNumbers.tauSum(10 ** 8));
console.timeEnd();
debugger;
