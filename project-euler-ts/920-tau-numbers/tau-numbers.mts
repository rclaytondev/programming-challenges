import { MathUtils } from "../../utils-ts/modules/math/MathUtils.mjs";

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
				debugger;
				minimalNumbers.set(divisors, n);
			}
		}
		return MathUtils.sum([...minimalNumbers.keys()]);
	}
}


console.time();
console.log(TauNumbers.tauSum(10 ** 5));
console.timeEnd();
debugger;
