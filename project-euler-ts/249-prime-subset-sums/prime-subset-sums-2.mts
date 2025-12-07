import { BigintMath } from "../../utils-ts/modules/math/BigintMath.mjs";
import { MathUtils } from "../../utils-ts/modules/math/MathUtils.mjs";
import { Sequence } from "../../utils-ts/modules/math/Sequence.mjs";
import { CountLogger } from "../project-specific-utilities/CountLogger.mjs";

export const primeSubsetSums = (upperBound: bigint, modulo: bigint = 10n ** 16n) => {
	const primes = [...Sequence.PRIMES.termsBelow(Number(upperBound), "exclusive")].map(BigInt);
	let numSetsWithSums = new Map([[0n, 1n]]); // of the first 0 primes, 1 set has a sum of 0
	for(const prime of primes) {
		const nextSums = new Map<bigint, bigint>();
		for(const [sum, numSets] of numSetsWithSums) {
			nextSums.set(sum, ((nextSums.get(sum) ?? 0n) + numSets) % modulo);
			nextSums.set(sum + prime, ((nextSums.get(sum + prime) ?? 0n) + numSets) % modulo);
		}
		numSetsWithSums = nextSums;
	}
	return BigintMath.sum(
		[...numSetsWithSums.keys()]
		.filter(BigintMath.isPrime)
		.map(k => numSetsWithSums.get(k)!)
	) % modulo;
};

// console.time();
// console.log(primeSubsetSums(5000n));
// console.timeEnd();
// debugger;
