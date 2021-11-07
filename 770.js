const winnings = (function(givesLeft, takesLeft) {
	if(givesLeft === 0) { return 1; }
	if(takesLeft === 0) { return 2 ** givesLeft; }
	const multiplier1 = winnings(givesLeft, takesLeft - 1);
	const multiplier2 = winnings(givesLeft - 1, takesLeft);
	const optimalBet = (multiplier1 - multiplier2) / (multiplier1 + multiplier2);
	const multiplier = multiplier1 * (1 - optimalBet);
	return multiplier;
}).memoize(true);
testing.addUnit("winnings()", winnings, [
	[1, 1, 4/3]
]);

const invWinnings = (desiredGold) => {
	for(let n = 1; n < Infinity; n ++) {
		if(winnings(n, n) >= desiredGold) {
			return n;
		}
	}
};
