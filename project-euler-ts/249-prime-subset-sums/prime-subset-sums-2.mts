import { MathUtils } from "../../utils-ts/modules/math/MathUtils.mjs";
import { Sequence } from "../../utils-ts/modules/math/Sequence.mjs";

export const primeSubsetSums = (upperBound: number, modulo: number = 10 ** 16) => {
	const primes = [...Sequence.PRIMES.termsBelow(upperBound, "exclusive")];
	const numSetsWithSums = [new Map([[0, 1]])]; // of the first 0 primes, 1 set has a sum of 0
	for(const prime of primes) {
		const currentSums = numSetsWithSums[numSetsWithSums.length - 1];
		const nextSums = new Map<number, number>();
		for(const [sum, numSets] of currentSums) {
			nextSums.set(sum, ((nextSums.get(sum) ?? 0) + numSets) % modulo);
			nextSums.set(sum + prime, ((nextSums.get(sum + prime) ?? 0) + numSets) % modulo);
		}
		numSetsWithSums.push(nextSums);
	}
	const setsWithSums = numSetsWithSums[numSetsWithSums.length - 1];
	return MathUtils.sum(
		[...setsWithSums.keys()]
		.filter(MathUtils.isPrime)
		.map(k => setsWithSums.get(k)!)
	) % modulo;
};

console.time();
// console.log(primeSubsetSums(5000));
console.timeEnd();
debugger;
