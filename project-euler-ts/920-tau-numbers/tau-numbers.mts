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
	static minTauNumber(numDivisors: number, upperBound: number) {
		for(let k = 1; k * numDivisors <= upperBound; k ++) {
			if(MathUtils.divisors(k * numDivisors).length === numDivisors) {
				return k * numDivisors;
			}
		}
		return 0;
	}
	static minPrimeTauNumber(primeNumDivisors: number, upperBound: number) {
		const result = primeNumDivisors ** (primeNumDivisors - 1);
		return result <= upperBound ? result : 0;
	}

	static tauSum(upperBound: number) {
		const primes = new Set(Sequence.PRIMES.termsBelow(upperBound, "inclusive"));
		const composites = Utils.range(1, upperBound).filter(n => !primes.has(n));
		const iterator = new MultiplesIterator(composites);
		const minimalNumbers = new Map<number, number>();
		while(iterator.current <= upperBound) {
			const divisors = MathUtils.divisors(iterator.current).length;
			if(iterator.current % divisors === 0 && !minimalNumbers.has(divisors) && !primes.has(divisors)) {
				minimalNumbers.set(divisors, iterator.current);
				iterator.multipliers.delete(divisors);
			}
			if(iterator.multipliers.size === 0) { break; }
			iterator.step();
		}
		let sum = MathUtils.sum(minimalNumbers.values());
		for(const prime of primes) {
			const tauNumber = TauNumbers.minPrimeTauNumber(prime, upperBound);
			sum += tauNumber;
			if(tauNumber === 0) { break; }
		}
		return sum;
	}
}


console.time();
console.log(TauNumbers.tauSum(10 ** 6));
console.timeEnd();
debugger;
