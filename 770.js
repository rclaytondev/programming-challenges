const winnings = (function(givesLeft, takesLeft) {
	if(givesLeft === 0) { return new Factorization([]); }
	if(takesLeft === 0) { return new Factorization([givesLeft]); }
	const multiplier1 = winnings(givesLeft, takesLeft - 1);
	const multiplier2 = winnings(givesLeft - 1, takesLeft);
	const optimalBet = (multiplier1.subtract(multiplier2)).divide(multiplier1.add(multiplier2));
	const multiplier = multiplier1.multiply(new Factorization(1).subtract(optimalBet));
	return multiplier;
}).memoize(true);
testing.addUnit("winnings()", winnings, [
	[1, 1, new Factorization([2, -1])]
]);

const invWinnings = (desiredGold) => {
	for(let n = 1; n < Infinity; n ++) {
		if(winnings(n, n) >= desiredGold) {
			return n;
		}
	}
};


for(let i = 0; i < 10; i ++) {
	console.log(`winnings(${i}) = ${winnings(i, i).toString("pretty")}`);
}

for(let g = 0; g < 10; g ++) {
	for(let t = 0; t < 10; t ++) {
		const result = winnings(g, t);
		const numerator = result.numerator();
		const denominator = result.denominator();
		if(
			(
				numerator.exponents.length !== 0 &&
				numerator.exponents.slice(1).some(v => v !== 0)
			) ||
			!denominator.exponents.every(v => v === 1 || v === 0)
		) {
			console.log(`found a counterexample: winnings(${g}, ${t}) = ${result.toString("pretty")}`);
		}
	}
}
console.log(`finished searching for counterexamples`);
