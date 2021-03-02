const COIN_VALUES = [1, 2, 5, 10, 20, 50, 100, 200];
const waysToMake = (total, calledRecursively = false) => {
	/*
	returns an array of numbers, where each number is the number of coins used in a way to make the total.
	*/
	debugger;
	if(calledRecursively) {
		if(total < 1) { return []; }
		if(total == 1) { return [1]; }
		let result = [];
		COIN_VALUES.forEach(coinValue => {
			const coinCounts = waysToMake(total - coinValue, true);
			result = result.concat(coinCounts.map(c => c + 1));
		});
		return result;
	}
	else {
		if(total < 1) { return 0; }
		let resultCoinCounts = [];
		COIN_VALUES.filter(c => c <= total).forEach(coinValue => {
			const coinCounts = waysToMake(total - coinValue, true);
			resultCoinCounts = resultCoinCounts.concat(coinCounts.map(c => c + 1));
			if(coinValue === total) {
				resultCoinCounts.push(1);
			}
		});
		return resultCoinCounts.sum(c => 1 / factorial(c));
	}
};
const factorial = ((number) => {
	if(number <= 1) { return 1; }
	return factorial(number - 1) * number;
}).memoize(true);

testing.addUnit("waysToMake()", [
	waysToMake,
	[1, 1],
	[2, 2], // {2} and {1, 1}
	[3, 2], // {2, 1} and {1, 1, 1}
	[4, 3], // {2, 2}, {2, 1, 1}, and {1, 1, 1, 1}
	[5, 5] // {5}, {4, 1}, {2, 2, 1}, {2, 1, 1, 1, 1}, {1, 1, 1, 1, 1}
]);
// testing.testAll();
testing.runTestByName("waysToMake() - test case 2");
