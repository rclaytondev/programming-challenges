import { MathUtils } from "../../utils-ts/modules/math/MathUtils.mjs";
import { Sequence } from "../../utils-ts/modules/math/Sequence.mjs";
import { isDivisible } from "./divisible-ranges.mjs";

export class Wheel {
	readonly primes: number[];
	readonly offsets: number[];
	readonly size: number;

	constructor(primes: number[], offsets: number[]) {
		this.primes = primes;
		this.offsets = offsets;
		this.size = MathUtils.product(primes);
	}

	*values() {
		for(let multiplier = 0; multiplier < Infinity; multiplier ++) {
			for(const offset of this.offsets) {
				yield multiplier * this.size + offset;
			}
		}
	}

	static create(numPrimes: number): Wheel {
		if(numPrimes === 1) {
			return new Wheel([2], [1]);
		}
		const primes = Sequence.PRIMES.slice(0, numPrimes);
		const size = MathUtils.product(primes);
		const lastPrime = primes[primes.length - 1];
		const previousWheel = Wheel.create(numPrimes - 1);
		const offsets = [];
		for(const value of previousWheel.values()) {
			if(value >= size) { break; }
			if(value % lastPrime !== 0) {
				offsets.push(value);
			}
		}
		return new Wheel(primes, offsets);
	}

	static *values(numPrimes: number) {
		const SMALLER_WHEEL_MAX_NUM_PRIMES = 8;
		console.time("computing wheel offsets");
		const smallerWheel = Wheel.create(Math.min(numPrimes, SMALLER_WHEEL_MAX_NUM_PRIMES));
		console.timeEnd("computing wheel offsets");
		const remainingPrimes = Sequence.PRIMES.slice(smallerWheel.primes.length, numPrimes);
		for(const value of smallerWheel.values()) {
			if(remainingPrimes.every(p => value % p !== 0)) {
				yield value;
			}
		}
	}
}

const consecutiveTuples = function*<T>(iterable: Iterable<T>, tupleSize: number) {
	let tuple = [];
	for(const value of iterable) {
		tuple.push(value);
		if(tuple.length > tupleSize) {
			tuple.shift();
		}
		if(tuple.length >= tupleSize) {
			yield tuple;
		}
	}
};

const divisibleRanges = (size: number) => {
	const numPrimes = [...Sequence.PRIMES.termsBelow(size)].length;
	return new Sequence(function*() {
		yield 1;
		for(const [value, next, afterNext] of consecutiveTuples(Wheel.values(numPrimes), 3)) {
			if(value > 100000000) { break; }
			for(let firstInRange = value + 1; firstInRange <= next && firstInRange + size <= afterNext; firstInRange ++) {
				// console.log(`(new algorithm) checking ${firstInRange}`);
				if(isDivisible(size, firstInRange)) {
					yield firstInRange;
				}
			}
		}
		throw new Error("Unreachable");
	});
};

export const solve = (size: number) => {
	return divisibleRanges(size).getTerm(size - 1);
};

try {
	console.time("solving the problem");
	console.log(solve(36));
}
catch(e) {
	console.timeEnd("solving the problem");
	debugger;
}
