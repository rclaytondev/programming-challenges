const naiveSolution = (log2OfDivisors) => {
	const divisors = 2 ** log2OfDivisors;
	for(let i = 0; i < Infinity; i ++) {
		if(Math.divisors(i).length === divisors) {
			return i;
		}
	}
};
const leastWith2ToTheNDivisors = (log2OfDivisors, modulo = Infinity) => {
	log2OfDivisors = BigInt(log2OfDivisors);
	const exponents = [];
	const indices = [0];
	const multipliers = [2n];
	for(let i = 0; i < log2OfDivisors; i ++) {
		const index = indices[0];
		const exponent = exponents[index] ?? 0;
		exponents[index] = 2 * exponent + 1;
		multipliers.shift(), indices.shift();
		for(const possibleIndex of [index, index + 1]) {
			if(!possibleIndex || exponents[possibleIndex] < exponents[possibleIndex - 1] || possibleIndex === exponents.length) {
				const multiplier = BigInt(Sequence.PRIMES.nthTerm(possibleIndex)) ** BigInt((exponents[possibleIndex] ?? 0) + 1);
				for(let j = 0; j <= multipliers.length; j ++) {
					if((multipliers[j] ?? Infinity) > multiplier) {
						multipliers.splice(j, 0, multiplier);
						indices.splice(j, 0, possibleIndex);
						break;
					}
				}
			}
		}
	}
	let result = 1;
	exponents.forEach((exponent, index) => {
		result *= Sequence.PRIMES.nthTerm(index) ** exponent;
		result %= modulo;
	});
	return result;
};
testing.addUnit(leastWith2ToTheNDivisors, [
	[2, 6n],
	[3, 24n],
	[4, 120n],
	[5, 840n],
	[6, 7560n],
	[7, 83160n],

	// tests for the modular arithmetic
	[7, 1000, 160n],
	[7, 31, 18n],
	[6, 1000, 560n]
]);




// for(let d = 1; d < Infinity; d ++) {
// 	const theAnswer = naiveSolution(d);
// 	const exponents = Math.factorize(theAnswer, "exponents-list");
// 	const string = exponents.map((e, i) => `${e === 1 ? Sequence.PRIMES.nthTerm(i) : `${Sequence.PRIMES.nthTerm(i)}^${e}`}`).join(" * ");
// 	console.log(`${theAnswer} = ${string} is the smallest number with 2^${d} = ${2 ** d} divisors`);
// }
