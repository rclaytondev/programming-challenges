const pentagonals = new Sequence(
	(n) => (n + 1) * (3 * (n + 1) - 1) / 2,
	{ isMonotonic: true }
);
pentagonals.indexOf = (n) => {
	const result = (1/2 + Math.sqrt(1/4 + 6 * n)) / 3 - 1;
	return (result === Math.round(result)) ? result : -1;
};
pentagonals.includes = (n) => pentagonals.indexOf(n) !== -1;

const solve = () => {
	for(const [difference, j] of pentagonals.entries()) {
		for(const [smaller, i] of pentagonals.entries()) {
			const larger = smaller + difference;
			const sum = smaller + larger;
			if(pentagonals.includes(larger) && pentagonals.includes(sum)) {
				console.log(`the answer is ${difference}`);
				return difference;
			}
			if(3 * i + 4 > difference) { break; }
		}
		if(j % 10 === 0) {
			console.log(difference);
		}
	}
};
