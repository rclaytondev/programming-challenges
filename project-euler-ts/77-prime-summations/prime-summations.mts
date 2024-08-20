import { Sequence } from "../../utils-ts/modules/math/Sequence.mjs";

const solve = () => {
	for(let n = 1; n < Infinity; n ++) {
		if(Sequence.PRIMES.numMultisetsWithSum(n) > 5000) {
			return n;
		}
	}
	throw new Error("Unreachable");
};

// console.time();
// console.log(solve());
// console.timeEnd();
// debugger;
