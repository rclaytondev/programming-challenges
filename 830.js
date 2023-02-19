const stirling = (function stirling(setSize, partitionSize) {
	if(setSize >= 0 && partitionSize === setSize) { return 1; }
	if(setSize === 0 || partitionSize === 0) { return 0; }
	return partitionSize * stirling(setSize - 1, partitionSize) + stirling(setSize - 1, partitionSize - 1);
}).memoize(true);
testing.addUnit(stirling, [
	[3, 2, 3],
	[10, 5, 42525]
]);
const fallingPower = (n, power) => {
	let product = 1;
	for(let i = 0; i < power; i ++) {
		product *= (n - i);
	}
	return product;
};
testing.addUnit(fallingPower, [
	[6, 2, 6 * 5],
	[6, 3, 6 * 5 * 4]
]);

const solve = (upperBound) => {
	let sum = 0;
	for(let k = 0; k <= upperBound; k ++) {
		sum += stirling(upperBound, k) * fallingPower(upperBound, k) * 2 ** (upperBound - k);
	}
	return sum;
};

testing.addUnit(solve, [
	[10, 142469423360]
]);
