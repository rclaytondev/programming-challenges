import { MathUtils } from "../../utils-ts/modules/math/MathUtils.mjs";
import { Sequence } from "../../utils-ts/modules/math/Sequence.mjs";
import { PriorityQueue } from "../../utils-ts/modules/PriorityQueue.mjs";
import { Utils } from "../../utils-ts/modules/Utils.mjs";

export class MultiplesIterator {
	multipliers: Set<number>;
	current: number;
	queue: PriorityQueue<number>;

	constructor(multiples: number[]) {
		this.multipliers = new Set(multiples);
		this.current = multiples[0];
		this.queue = new PriorityQueue();
		for(const n of this.multipliers) {
			this.queue.insert(n, n);
		}
	}

	next() {
		let multiplier, multiple;
		do {
			[multiplier, multiple] = this.queue.popWithPriority();
			if(this.multipliers.has(multiplier)) {
				this.queue.insert(multiplier, multiplier + multiple);
			}
		} while(multiple <= this.current || !this.multipliers.has(multiplier));
		return multiple;
	}
	step() {
		this.current = this.next();
	}
}

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


	static minTauNumberSearch(primes: number[], minExponents: number[], exponents: number[], numDivisors: number) {
		const divisors = MathUtils.product(exponents.map(e => e + 1));
		const remaining = numDivisors / divisors;
		if(exponents.length === minExponents.length) {
			let minimum = Infinity;
			for(const partition of TauNumbers.productPartitions(remaining)) {
				const unusedPrimes = Sequence.PRIMES.filter(p => !primes.includes(p)).slice(0, partition.length);
				minimum = Math.min(
					minimum,
					MathUtils.product([...primes.map((p, i) => p ** exponents[i]), ...unusedPrimes.map((q, i) => q ** (partition[i] - 1))])
				);
			}
			return minimum;
		}
		else {
			const nextTerms = MathUtils.divisors(remaining);
			let minimum = Infinity;
			for(let i = nextTerms.length - 1; i >= 0; i --) {
				if(nextTerms[i] - 1 < minExponents[exponents.length]) { break; }
				minimum = Math.min(minimum, TauNumbers.minTauNumberSearch(primes, minExponents, [...exponents, nextTerms[i] - 1], numDivisors));
			}
			return minimum;
		}
	}
	static minTauNumber(numDivisors: number) {
		const factorization = MathUtils.factorize(numDivisors);
		const primes = [...factorization.keys()];
		return TauNumbers.minTauNumberSearch(
			primes,
			primes.map(p => factorization.get(p)!),
			[],
			numDivisors
		);
	}
	static minPrimeTauNumber(primeNumDivisors: number, upperBound: number) {
		const result = primeNumDivisors ** (primeNumDivisors - 1);
		return result <= upperBound ? result : 0;
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
