import { MathUtils } from "../../utils-ts/modules/math/MathUtils.mjs";
import { PriorityQueue } from "../../utils-ts/modules/PriorityQueue.mjs";

export class MultiplesIterator {
	multipliers: Set<number>;
	current: number;
	queue: PriorityQueue<number>;

	constructor(multiples: Iterable<number>) {
		this.multipliers = new Set(multiples);
		this.current = Math.min(...multiples);
		this.queue = new PriorityQueue();
		for(const n of this.multipliers) {
			this.queue.insert(n, n);
		}
	}

	step() {
		let multiplier, multiple;
		do {
			[multiplier, multiple] = this.queue.popWithPriority();
			if(this.multipliers.has(multiplier)) {
				this.queue.insert(multiplier, multiplier + multiple);
			}
		} while(multiple <= this.current || !this.multipliers.has(multiplier));
		this.current = multiple;
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

	static tauSum(upperBound: number) {
		const minimalNumbers = new Map<number, number>();
		for(let n = 1; n <= upperBound; n ++) {
			const divisors = MathUtils.divisors(n).length;
			if(n % divisors === 0 && !minimalNumbers.has(divisors)) {
				minimalNumbers.set(divisors, n);
			}
		}
		return MathUtils.sum([...minimalNumbers.values()]);
	}
}


// console.time();
// console.log(TauNumbers.tauSum(10 ** 6));
// console.timeEnd();
// debugger;
