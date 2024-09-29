const largestIdempotent = (modulo: number) => {
	for(let i = modulo - 1; i > 1; i --) {
		if((i ** 2) % modulo === i) {
			return i;
		}
	}
	return 1;
};

export const naiveIdempotentSum = (upperBound: number) => {
	let sum = 0;
	for(let m = 1; m <= upperBound; m ++) {
		sum +=  largestIdempotent(m);
	}
	return sum;
};

export const naiveIdempotents = (modulo: number) => {
	const result = [];
	for(let i = 0; i < modulo; i ++) {
		if(i ** 2 % modulo === i) {
			result.push(i);
		}
	}
	return result;
};

export const naiveAllIdempotents = (upperBound: number) => {
	const result = new Map<number, number[]>();
	for(let i = 2; i <= upperBound; i ++) {
		result.set(i, naiveIdempotents(i));
	}
	return result;
};
