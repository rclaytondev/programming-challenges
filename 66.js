const minimalSolution = (d) => {
	for(let x = 2; x < Infinity; x ++) {
		if(Math.sqrt((x ** 2 - 1) / d) % 1 === 0) {
			return x;
		}
	}
};

const solve = () => {
	let largestD = null;
	let largestX = -Infinity;
	for(let d = 1; d <= 1000; d ++) {
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
