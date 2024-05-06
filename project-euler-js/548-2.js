const numGozintaChains = (function (start, end) {
	if(arguments.length === 1) {
		const [number] = arguments;
		const factorization = Math.factorize(number, "exponents-list");
		const sorted = factorization.sort(Array.SORT_DESCENDING);
		const newNumber = Math.defactorize(sorted);
		// if(number !== newNumber) { debugger; }
		return numGozintaChains(1, newNumber);
	}
	else {
		if(start === end) { return 1; }
		const divisors = Math.divisors(end);
		let result = 0;
		for(const divisor of divisors) {
			if(divisor > start && divisor % start === 0) {
				result += numGozintaChains(divisor, end);
			}
		}
		return result;
	}
}).memoize(true);
const solve = (upperBound = 1e16) => {
	let sum = 0;
	for(let i = 1; i <= upperBound; i ++) {
		if(numGozintaChains(i) === i) {
			console.log(`g(${i}) = ${i}`);
			sum += i;
		}
	}
	return sum;
};
console.log(solve(1e4));

// testing.addUnit("numGozintaChains()", numGozintaChains, [
// 	[1, 12, 8],
// 	[1, 48, 48],
// 	[1, 120, 132]
// ]);
