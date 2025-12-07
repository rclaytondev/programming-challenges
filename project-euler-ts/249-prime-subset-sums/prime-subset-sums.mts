import { GenUtils } from "../../utils-ts/modules/core-extensions/GenUtils.mjs";
import { MathUtils } from "../../utils-ts/modules/math/MathUtils.mjs";
import { Sequence } from "../../utils-ts/modules/math/Sequence.mjs";

export const primeSubsetSums = (upperBound: number) => {
	const primes = Sequence.PRIMES.termsBelow(upperBound, "exclusive");
	return (
		[...GenUtils.subsets([...primes])]
		.filter(s => MathUtils.isPrime(MathUtils.sum(s)))
		.length
	);
};

// console.time();
// console.log(primeSubsetSums(30));
// console.timeEnd();
// debugger;
