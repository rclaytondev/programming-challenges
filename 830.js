const stirling = (function stirling(setSize, partitionSize, modulo = Infinity) {
	if(setSize >= 0n && partitionSize === setSize) { return 1n; }
	if(setSize === 0n || partitionSize === 0n) { return 0n; }
	const result = (partitionSize * stirling(setSize - 1n, partitionSize, modulo) + stirling(setSize - 1n, partitionSize - 1n, modulo));
	if(modulo !== Infinity) {
		return result % modulo;
	}
	else { return result; }
}).memoize(true);
testing.addUnit(stirling, [
	[3n, 2n, 3n],
	[10n, 5n, 42525n],
	[10n, 5n, 17n, 8n]
]);
const fallingPower = (n, power, modulo = Infinity) => {
	let product = 1n;
	for(let i = 0n; i < power; i ++) {
		if(modulo !== Infinity) {
			product = (product * (n - i)) % modulo;
		}
		else { product *= n - i; }
	}
	return product;
};
testing.addUnit(fallingPower, [
	[6n, 2n, BigInt(6 * 5)],
	[6n, 3n, BigInt(6 * 5 * 4)],
	[10n, 5n, 30240n],
	[10n, 5n, 17n, 14n]
]);

const solve = (upperBound = BigInt(10 ** 18), modulo = BigInt(83 ** 3 * 89 ** 3, 97 ** 3)) => {
	upperBound = BigInt(upperBound);
	let sum = 0n;
	for(let k = 0n; k <= upperBound; k ++) {
		sum += stirling(upperBound, k, modulo) * fallingPower(upperBound, k, modulo) * Math.modularExponentiate(modulo, 2, upperBound - k);
		sum %= modulo;
	}
	return sum;
};

testing.addUnit(solve, [
	[10n, 142469423360n],
	[10n, 17n, 5n]
]);
