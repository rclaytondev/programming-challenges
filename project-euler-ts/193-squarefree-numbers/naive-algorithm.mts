export const isSquarefree = (num: number) => {
	for(let i = 2; i ** 2 <= num; i ++) {
		if(num % i ** 2 === 0) {
			return false;
		}
	}
	return true;
};

export const naiveNumSquarefree = (upperBound: number) => {
	let count = 0;
	for(let i = 1; i < upperBound; i ++) {
		if(isSquarefree(i)) {
			count ++;
		}
	}
	return count;
};
