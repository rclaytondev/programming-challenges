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
		let sum = 0;
		for(let numDivisors = 1; numDivisors <= upperBound; numDivisors ++) {
			sum += TauNumbers.minTauNumber(numDivisors, upperBound);
		}
		return sum;
	}
}


console.time();
console.log(TauNumbers.tauSum(10 ** 5));
console.timeEnd();
debugger;
