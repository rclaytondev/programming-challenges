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

export class TauNumberFactorization {
	primes: number[];
	nextPrime: number;
	nextMaxExponent: number;
	minExponents: number[];
	remainingDivisors: number;
	upperBound: number;

	constructor(primes: number[], nextPrime: number, nextMaxExponent: number, minExponents: number[], remainingDivisors: number, upperBound: number) {
		this.primes = primes;
		this.nextPrime = nextPrime;
		this.nextMaxExponent = nextMaxExponent;
		this.minExponents = minExponents;
		this.remainingDivisors = remainingDivisors;
		this.upperBound = upperBound;
	}

	next() {
		const index = this.primes.indexOf(this.nextPrime);
		const minDivisor = (this.minExponents[index] ?? 0) + 1;
		const maxDivisor = this.nextMaxExponent + 1;
		const next = [];
		for(const divisor of MathUtils.divisors(this.remainingDivisors)) {
			if(minDivisor <= divisor && divisor <= maxDivisor) {
				const exponent = divisor - 1;
				next.push(this.createNextFrom(exponent));
			}
		}
		return next;
	}

	createNextFrom(exponent: number) {
		const index = this.primes.indexOf(this.nextPrime);
		if(index >= 0 && index !== this.primes.length - 1) {
			return new TauNumberFactorization(
				this.primes,
				this.primes[index + 1],
				Infinity,
				this.minExponents,
				this.remainingDivisors / (exponent + 1),
				Math.floor(this.upperBound / (this.nextPrime ** exponent))
			);
		}
		else {
			return new TauNumberFactorization(
				this.primes,
				TauNumbers.nextPrime(index >= 0 ? 1 : this.nextPrime, this.primes),
				exponent,
				this.minExponents,
				this.remainingDivisors / (exponent + 1),
				Math.floor(this.upperBound / (this.nextPrime ** exponent))
			);
		}
	}

	isComplete() {
		return !this.primes.includes(this.nextPrime) && this.remainingDivisors === 1;
	}
}

export class TauNumbers {
	static nextPrime(start: number, primesToSkip: number[]) {
		for(let i = start + 1; true; i ++) {
			if(MathUtils.isPrime(i) && !primesToSkip.includes(i)) {
				return i;
			}
		}
	}

	static completion(factorization: TauNumberFactorization) {
		
	}

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
