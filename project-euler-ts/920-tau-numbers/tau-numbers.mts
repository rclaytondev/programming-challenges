import { MathUtils } from "../../utils-ts/modules/math/MathUtils.mjs";
import { PriorityQueue } from "../../utils-ts/modules/PriorityQueue.mjs";

class TauNumberFactorization {
	product: number;
	primes: number[];
	exponents: number[];
	otherExponents: number[];

	constructor(product: number, primes: number[], exponents: number[], otherExponents: number[]) {
		this.product = product;
		this.primes = primes;
		this.exponents = exponents;
		this.otherExponents = otherExponents;
	}
}

export class TauNumbers {
	static cache: Map<number, number | PriorityQueue<TauNumberFactorization>>;

	static minTauNumber(requiredDivisors: number, upperBound: number) {
		/* Returns the smallest multiple with that many divisors, or +Inf if it is bigger than the upper bound. */
		const precalculated = TauNumbers.cache.get(requiredDivisors);
		if(typeof precalculated === "number") {
			return precalculated <= upperBound ? precalculated : Infinity;
		}
		else if(precalculated != null) {
			return TauNumbers.minTauNumberSearch(precalculated, upperBound);
		}
		else {
			const primeDivisors = MathUtils.factors(requiredDivisors);
			const ONE = new TauNumberFactorization(1, primeDivisors, [], []);
			const queue = new PriorityQueue<TauNumberFactorization>();
			queue.insert(ONE, 1);
			return TauNumbers.minTauNumberSearch(queue, upperBound);
		}
	}

	static minTauNumberSearch(queue: PriorityQueue<TauNumberFactorization>, upperBound: number) {
		
	}
}


// console.time();
// console.log(TauNumbers.tauSum(10 ** 8));
// console.timeEnd();
// debugger;
