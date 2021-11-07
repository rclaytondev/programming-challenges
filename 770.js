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
