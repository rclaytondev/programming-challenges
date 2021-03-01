const COIN_VALUES = [1, 2, 5, 10, 20, 50, 100, 200];
const waysToMake = (number) => {
	/*
	returns (in a 2-element array):
	- the number of ways this number can be expressed as a sum of different coin values.
	- the number of coins used in each way.
	*/
	if(number < 1) { return 0; }
	
};

testing.addUnit("waysToMake()", [
	input => waysToMake(input)[0],
	[1, 1],
	[2, 2], // {2} and {1, 1}
	[3, 2], // {2, 1} and {1, 1, 1}
	[4, 3], // {2, 2}, {2, 1, 1}, and {1, 1, 1, 1}
	[5, 5] // {5}, {4, 1}, {2, 2, 1}, {2, 1, 1, 1, 1}, {1, 1, 1, 1, 1}
]);
testing.testAll();
