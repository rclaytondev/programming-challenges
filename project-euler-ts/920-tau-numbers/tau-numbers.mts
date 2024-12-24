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
	remainingMinExponents: number[];
	remainingDivisors: number;
	upperBound: number;

	constructor(primes: number[], nextPrime: number, nextMaxExponent: number, remainingMinExponents: number[], remainingDivisors: number, upperBound: number) {
		this.primes = primes;
		this.nextPrime = nextPrime;
		this.nextMaxExponent = nextMaxExponent;
		this.remainingMinExponents = remainingMinExponents;
		this.remainingDivisors = remainingDivisors;
		this.upperBound = upperBound;
	}

	next() {
		const minDivisor = (this.remainingMinExponents[0] ?? 1) + 1;
		const maxDivisor = this.nextMaxExponent + 1;
		const next = [];
		for(const divisor of MathUtils.divisors(this.remainingDivisors)) {
			if(minDivisor <= divisor && divisor <= maxDivisor) {
				const exponent = divisor - 1;
				next.push([this.createNextFrom(exponent), exponent] as [TauNumberFactorization, number]);
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
				this.remainingMinExponents.slice(1),
				this.remainingDivisors / (exponent + 1),
				Math.floor(this.upperBound / (this.nextPrime ** exponent))
			);
		}
		else {
			return new TauNumberFactorization(
				this.primes,
				TauNumbers.nextPrime(index >= 0 ? 1 : this.nextPrime, this.primes),
				exponent,
				this.remainingMinExponents.slice(1),
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
		if(factorization.isComplete()) {
			return 1;
		}
		if(factorization.upperBound < 1) {
			return Infinity;
		}
		let min = Infinity;
		for(const [next, exponent] of factorization.next()) {
			min = Math.min(min, TauNumbers.completion(next) * (factorization.nextPrime ** exponent));
		}
		return min;
	}

	static minTauNumber(divisors: number, upperBound: number) {
		const factorization = MathUtils.factorize(divisors);
		const primes = [...factorization.keys()];
		return TauNumbers.completion(new TauNumberFactorization(
			primes,
			primes[0],
			Infinity,
			primes.map(p => factorization.get(p)!),
			divisors,
			upperBound
		));
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


console.time();
console.log(TauNumbers.tauSum(10 ** 8));
console.timeEnd();
debugger;
