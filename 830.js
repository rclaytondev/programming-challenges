const stirling = (function stirling(setSize, partitionSize) {
	if(setSize >= 0n && partitionSize === setSize) { return 1n; }
	if(setSize === 0n || partitionSize === 0n) { return 0n; }
	return partitionSize * stirling(setSize - 1n, partitionSize) + stirling(setSize - 1n, partitionSize - 1n);
}).memoize(true);
testing.addUnit(stirling, [
	[3n, 2n, 3n],
	[10n, 5n, 42525n]
]);
const fallingPower = (n, power) => {
	let product = 1n;
	for(let i = 0n; i < power; i ++) {
		product *= (n - i);
	}
	return product;
};
testing.addUnit(fallingPower, [
	[6n, 2n, BigInt(6 * 5)],
	[6n, 3n, BigInt(6 * 5 * 4)]
]);

const solve = (upperBound) => {
	let sum = 0n;
	for(let k = 0n; k <= upperBound; k ++) {
		sum += stirling(upperBound, k) * fallingPower(upperBound, k) * 2n ** (upperBound - k);
	}
	return sum;
};

testing.addUnit(solve, [
	[10n, 142469423360n]
]);
