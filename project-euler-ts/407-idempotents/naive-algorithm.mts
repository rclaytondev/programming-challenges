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
