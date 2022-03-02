const leastWith2ToTheNDivisors = (log2OfDivisors) => {
	let smallestNumber = Infinity;
	for(const exponents of Tree.iterate([], function*(exponents) {
		if(
			exponents.map(e => e + 1).product() >= 2 ** log2OfDivisors
		) { return; }
		let minExponent = 1;
		let maxExponent = (exponents.length) ? exponents[exponents.length - 1] : 2 ** log2OfDivisors - 1;
		for(let exponent = minExponent; exponent <= maxExponent; exponent = exponent * 2 + 1) {
			yield [...exponents, exponent];
		}
	}, false, "bfs")) {
		const divisors = exponents.map(e => e + 1).product();
		const number = Math.defactorize(exponents);
		if(number < smallestNumber && divisors === 2 ** log2OfDivisors) {
			smallestNumber = number;
		}
	}
	return smallestNumber;
};
testing.addUnit(leastWith2ToTheNDivisors, [
	[2, 6n],
	[3, 24n],
	[4, 120n],
	[5, 840n],
	[6, 7560n],
	[7, 83160n]
]);
