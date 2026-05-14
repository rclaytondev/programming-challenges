import { Sequence } from "../../utils-ts/modules/math/Sequence.mjs";

// const logger = new CountLogger(n => 1000 * n);

export const solve = (upperBound: number) => {
	const expressibles = new Set<number>();
	for(const prime1 of Sequence.PRIMES.termsBelow(upperBound ** (1/2))) {
		// logger.countTo(prime1);
		for(const prime2 of Sequence.PRIMES.termsBelow((upperBound - prime1 ** 2) ** (1/3))) {
			for(const prime3 of Sequence.PRIMES.termsBelow((upperBound - prime1 ** 2 - prime2 ** 3) ** (1/4))) {
				expressibles.add(prime1 ** 2 + prime2 ** 3 + prime3 ** 4);
			}
		}
	}
	return expressibles.size;
};

// console.log(solve(50000000));
// debugger;
