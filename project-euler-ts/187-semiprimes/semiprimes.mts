import { ArrayUtils } from "../../utils-ts/modules/core-extensions/ArrayUtils.mjs";
import { Sequence } from "../../utils-ts/modules/math/Sequence.mjs";

export const numSemiprimes = (upperBound: number) => {
	let total = 0;
	const primes = [...Sequence.PRIMES.termsBelow(upperBound)];
	for(const [i, prime] of primes.entries()) {
		const maxIndex = ArrayUtils.binaryIndexOf(upperBound / prime, primes, "first");
		if(maxIndex >= i) {
			total += (maxIndex - i + 1);
		}
	}
	return total;
};

// console.time();
// console.log(numSemiprimes(10 ** 8));
// console.timeEnd();
// debugger;
