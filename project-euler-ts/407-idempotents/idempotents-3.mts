const getLargestProperDivisor = (num: number) => {
	for(let i = 2; i ** 2 <= num; i ++) {
		if(num % i === 0) {
			return num / i;
		}
	}
	/* no proper divisors (num is prime) */
	return null;
};

const getIdempotents = (modulo: number, divisor: number, idempotentsForDivisor: number[]) => {
	const result = [];
	for(let multiple = 0; multiple < modulo; multiple += divisor) {
		for(const offset of idempotentsForDivisor) {
			const value = multiple + offset;
			if(value ** 2 % modulo === value) {
				result.push(value);
			}
		}
	}
	return result;
};

export const allIdempotents = (upperBound: number) => {
	const idempotents = new Map<number, number[]>();
	for(let i = 2; i <= upperBound; i ++) {
		const largestProperDivisor = getLargestProperDivisor(i);
		if(!largestProperDivisor) {
			/* i is prime --> no nontrivial idempotents since every nonzero element is invertible. */
			idempotents.set(i, [0, 1]);
		}
		else {
			idempotents.set(i, getIdempotents(i, largestProperDivisor, idempotents.get(largestProperDivisor)!));
		}
	}
	return idempotents;
};

export const idempotentSum = (upperBound: number) => {
	let result = 1;
	for(const idempotents of allIdempotents(upperBound).values()) {
		result += idempotents[idempotents.length - 1];
	}
	return result;
};
