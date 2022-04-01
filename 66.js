const minimalSolution = (d) => {
	for(let y = 1; y < Infinity; y ++) {
		const x = Math.sqrt(1 + d * y ** 2);
		if(x % 1 === 0) { return x; }
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
