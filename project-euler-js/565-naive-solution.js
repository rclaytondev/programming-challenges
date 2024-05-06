const calculateSum = (upperBound, divisorOfSum) => {
	let sum = 0;
	for(let i = 0; i <= upperBound; i ++) {
		if(Math.divisors(i).sum() % divisorOfSum === 0) {
			sum += i;
		}
	}
	return sum;
};
testing.addUnit(calculateSum, [
	[20, 7, 49],
]);
