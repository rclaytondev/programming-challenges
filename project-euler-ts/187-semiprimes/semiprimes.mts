import { Sequence } from "../../utils-ts/modules/math/Sequence.mjs";
import { Utils } from "../../utils-ts/modules/Utils.mjs";

export const numSemiprimes = (upperBound: number) => {
	let total = 0;
	const primes = [...Sequence.PRIMES.termsBelow(upperBound)];
	for(const [i, prime] of primes.entries()) {
		const maxIndex = Utils.binaryIndexOf(upperBound / prime, primes, "first");
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
