const COIN_VALUES = [1, 2, 5, 10, 20, 50, 100, 200];

const waysToMake = (total => {
	/*
	returns an array of arrays, where each array represents some numbers whose sum is `total`.
	*/
	if(total < 1) { return []; }
	if(total === 1) { return [[1]]; }

	let ways = [];
	COIN_VALUES.filter(c => c <= total).forEach(coinValue => {
		if(coinValue === total) {
			ways.push([coinValue]);
		}
		else {
			let waysWithThisCoin = waysToMake(total - coinValue);
			waysWithThisCoin.forEach(way => {
				way.push(coinValue);
				ways.push(way);
			});
		}
	});
	return ways;
}).memoize(true, true);
const numWaysToMake = (total) => {
	const ways = waysToMake(total);
	return new Set(ways.map(way => [...way].sort().join(","))).size;
};

testing.addUnit("numWaysToMake()", [
	numWaysToMake,
	[1, 1],
	[2, 2], // {2} and {1, 1}
	[3, 2], // {2, 1} and {1, 1, 1}
	[4, 3], // {2, 2}, {2, 1, 1}, and {1, 1, 1, 1}
	[5, 4] // {5}, {2, 2, 1}, {2, 1, 1, 1}, {1, 1, 1, 1, 1}
]);
testing.testAll();
testing.runTestByName("numWaysToMake() - test case 5");


console.time("solving the problem");
// console.log(numWaysToMake(200));
console.timeEnd("solving the problem");


// console.log(numWaysToMake(10));
