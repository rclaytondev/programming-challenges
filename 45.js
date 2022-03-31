const solve = () => {
	for(let i = 1; i < Infinity; i ++) {
		const hexagonalNumber = i * (2 * i - 1);
		const isPentagonal = (1 + Math.sqrt(1 + 24 * hexagonalNumber)) % 6 === 0;
		const isTriangular = (Math.sqrt(1 + 8 * hexagonalNumber) - 1) % 2 === 0;
		if(isPentagonal && isTriangular && hexagonalNumber > 40755) {
			return hexagonalNumber;
		}
	}
};
