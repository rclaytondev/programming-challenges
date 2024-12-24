import { MathUtils } from "../../utils-ts/modules/math/MathUtils.mjs";
import { Sequence } from "../../utils-ts/modules/math/Sequence.mjs";
import { PriorityQueue } from "../../utils-ts/modules/PriorityQueue.mjs";

class GeneratedIterable<T> {
	values: T[];
	generator: Generator<T>;

	constructor(generator: Generator<T>) {
		this.values = [];
		this.generator = generator;
	}
	*[Symbol.iterator]() {
		yield* this.values;
		for(const value of this.generator) {
			this.values.push(value);
			yield value;
		}
	}
}

export class TauNumbers {
	static tauSum(upperBound: number) {
		let sum = 0;
		const maxDivisors = 2 * (Math.sqrt(upperBound) - 1) + 1;
		for(let i = 1; i <= maxDivisors; i ++) {
			const smallest = TauNumbers.minTauNumber(i, upperBound);
			if(smallest <= upperBound) {
				// console.log(`${smallest} is the smallest multiple of ${i} with ${i} divisors.`)
				sum += smallest;
			}
		}
		return sum;
	}
}


// console.time();
// console.log(TauNumbers.tauSum(10 ** 10));
// console.timeEnd();
// debugger;
