import { Sequence } from "../../utils-ts/modules/math/Sequence.mjs";

export const numSquarefree = (upperBound: number, minPrimeIndex: number = 0): number => {
	const minPrime = Sequence.PRIMES.getTerm(minPrimeIndex);
	if(minPrime >= upperBound) {
		return 0;
	}
	return numSquarefree(
		Math.floor(upperBound / minPrime),
		minPrimeIndex + 1
	) + numSquarefree(
		upperBound,
		minPrimeIndex + 1
	);
};
