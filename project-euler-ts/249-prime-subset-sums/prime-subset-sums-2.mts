import { BigintMath } from "../../utils-ts/modules/math/BigintMath.mjs";
import { MathUtils } from "../../utils-ts/modules/math/MathUtils.mjs";
import { Sequence } from "../../utils-ts/modules/math/Sequence.mjs";

export const primeSubsetSums = (upperBound: number) => {
	const primes = [...Sequence.PRIMES.termsBelow(upperBound, "exclusive")];
	const numSetsWithSums = [new Map([[0n, 1n]])]; // of the first 0 primes, 1 set has a sum of 0
	for(const prime of primes.map(BigInt)) {
		const currentSums = numSetsWithSums[numSetsWithSums.length - 1];
		const nextSums = new Map<bigint, bigint>();
		for(const [sum, numSets] of currentSums) {
			nextSums.set(sum, (nextSums.get(sum) ?? 0n) + numSets);
			nextSums.set(sum + prime, (nextSums.get(sum + prime) ?? 0n) + numSets);
		}
		numSetsWithSums.push(nextSums);
	}
	const setsWithSums = numSetsWithSums[numSetsWithSums.length - 1];
	return BigintMath.sum(
		[...setsWithSums.keys()]
		.filter(n => MathUtils.isPrime(Number(n)))
		.map(k => setsWithSums.get(k)!)
	);
};

console.time();
console.log(primeSubsetSums(1000));
console.timeEnd();
debugger;
