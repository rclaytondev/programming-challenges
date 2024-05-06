const minimalSolution = (d) => {
	d = BigInt(d);
	for(let y = 1n; y < Infinity; y ++) {
		const x = utils.bigintSqrt(1n + d * y ** 2n);
		if(x ** 2n === 1n + d * y ** 2n) {
			return x;
		}
	}
};

const solve = (upperBound = 1000) => {
	let largestD = null;
	let largestX = -Infinity;
	for(let d = 1; d <= upperBound; d ++) {
		if(Math.sqrt(d) % 1 !== 0) {
			const x = minimalSolution(d);
			if(x > largestX) {
				largestD = d;
				largestX = x;
			}
		}
	}
	return largestD;
};
