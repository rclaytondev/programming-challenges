const pentagonals = new Sequence(
	(n) => (n + 1) * (3 * (n + 1) - 1) / 2,
	{ isMonotonic: true }
);
pentagonals.indexOf = (n) => {
	const result = (1/2 + Math.sqrt(1/4 + 6 * n)) / 3 - 1;
	return (result === Math.round(result)) ? result : -1;
};


const solve = () => {
	for(const [difference, index1] of pentagonals.entries()) {
		
	}
};
