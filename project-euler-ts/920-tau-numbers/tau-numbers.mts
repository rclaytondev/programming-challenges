import { MathUtils } from "../../utils-ts/modules/math/MathUtils.mjs";
import { Sequence } from "../../utils-ts/modules/math/Sequence.mjs";
import { PriorityQueue } from "../../utils-ts/modules/PriorityQueue.mjs";

class TauNumberFactorization {
	product: number;
	primes: number[];
	exponents: number[];
	otherExponents: number[];
	lastOtherPrime: number | null = null;
	divisors: number;

	constructor(product: number, primes: number[], exponents: number[], otherExponents: number[], lastOtherPrime: number | null, divisors: number) {
		this.product = product;
		this.primes = primes;
		this.exponents = exponents;
		this.otherExponents = otherExponents;
		this.lastOtherPrime = lastOtherPrime;
		this.divisors = divisors;
	}

	next(requiredDivisors: number) {
		const result = [];
		for(const divisor of MathUtils.divisors(requiredDivisors / this.divisors)) {
			const exponent = divisor - 1;
			if(exponent !== 0 && (
				this.exponents.length >= this.primes.length || 
				exponent >= TauNumbers.getExponent(this.primes[this.exponents.length], requiredDivisors)
			)) {
				result.push(this.createNextFrom(exponent));
			}
		}
		return result;
	}

	createNextFrom(nextExponent: number) {
		if(this.exponents.length < this.primes.length) {
			return new TauNumberFactorization(
				this.product * (this.primes[this.exponents.length] ** nextExponent),
				this.primes,
				[...this.exponents, nextExponent],
				this.otherExponents,
				null,
				this.divisors * (nextExponent + 1)
			);
		}
		else {
			const nextPrime = TauNumbers.nextPrime(this.lastOtherPrime ?? 1, this.primes);
			return new TauNumberFactorization(
				this.product * (nextPrime ** nextExponent),
				this.primes,
				this.exponents,
				[...this.otherExponents, nextExponent],
				nextPrime,
				this.divisors * (nextExponent + 1)
			);
		}
	}

	logMessage(requiredDivisors: number) {
		const otherPrimes = Sequence.PRIMES.filter(p => !this.primes.includes(p)).slice(0, this.otherExponents.length);
		const factorization1 = this.primes.slice(0, this.exponents.length).map((p, i) => `${p}^${this.exponents[i]}`).join(" * ");
		const factorization2 = otherPrimes.map((p, i) => `${p}^${this.otherExponents[i]}`).join(" * ");
		return `${this.product} = (${factorization1}) * (${factorization2}) has ${this.divisors} of the required ${requiredDivisors} divisors`;
	}

	isDone(requiredDivisors: number) {
		return this.exponents.length >= this.primes.length && this.divisors === requiredDivisors;
	}
}

export class TauNumbers {
	static getExponent(prime: number, num: number) {
		let exponent = 0;
		while(num % prime === 0) {
			num /= prime;
			exponent ++;
		}
		return exponent;
	}

	static nextPrime(start: number, primesToSkip: number[]) {
		for(let i = start + 1; true; i ++) {
			if(MathUtils.isPrime(i) && !primesToSkip.includes(i)) {
				return i;
			}
		}
	}

	static minTauNumber(requiredDivisors: number, upperBound: number) {
		/* Returns the smallest multiple with that many divisors, or +Inf if it is bigger than the upper bound. */
		const primeDivisors = MathUtils.factors(requiredDivisors);
		const ONE = new TauNumberFactorization(1, primeDivisors, [], [], null, 1);
		const queue = new PriorityQueue<TauNumberFactorization>();
		queue.insert(ONE, 1);
		return TauNumbers.minTauNumberSearch(queue, requiredDivisors, upperBound);
	}

	static minTauNumberSearch(queue: PriorityQueue<TauNumberFactorization>, requiredDivisors: number, upperBound: number) {
		while(true) {
			const current = queue.pop();
			// console.log(`currently checking: ${current.logMessage(requiredDivisors)}`);
			if(current.isDone(requiredDivisors)) {
				return current.product;
			}
			for(const next of current.next(requiredDivisors)) {
				// console.log(`adding to queue: ${next.logMessage(requiredDivisors)}`);
				queue.insert(next, next.product);
			}
		}
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
