const totient = (n) => {
	let exponentOn2 = 0;
	while(n % 2 === 0) {
		n /= 2;
		exponentOn2 ++;
	}
	let result = (exponentOn2 === 0) ? 1 : 2 ** (exponentOn2 - 1);
	for(let i = 3; i * i <= n; i ++) {
		let exponent = 0;
		while(n % i === 0) {
			n /= i;
			exponent ++;
		}
		result *= (exponent === 0) ? 1 : (i ** (exponent - 1)) * (i - 1);
	}
	if(n !== 1) { result *= (n - 1); }
	return result;
};
testing.addUnit("totient()", totient, [
	[5, 4],
	[7, 6],
	[8, 4],
	[9, 6],
	[10, 4],
	[14, 6],
	[18, 6]
]);

const chainLength = ((n) => {
	if(n === 1) { return 1; }
	return chainLength(totient(n)) + 1;
}).memoize(true);
const solve = (upperBound = 4e7, length = 25) => {
	let result = 0;
	for(const prime of Sequence.PRIMES) {
		if(prime >= upperBound) { break; }
		if(chainLength(prime) === length) {
			result += prime;
		}
	}
	return result;
};
console.time();
// console.log(solve(1e5, 25));
// console.log(solve());
console.timeEnd();
