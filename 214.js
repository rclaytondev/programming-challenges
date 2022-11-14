const totient = (n) => {
	let result = 0;
	for(let i = 1; i <= n; i ++) {
		if(Math.gcd(i, n) === 1) {
			result ++;
		}
	}
	return result;
};
testing.addUnit("totient()", totient, [
	[5, 4],
	[14, 6],
	[18, 6]
]);

const solve = (upperBound = 40000000, length = 25) => {
	let lengths = [0, 1];
	let result = 0;
	for(let i = 2; i < upperBound; i ++) {
		lengths[i] = lengths[totient(i)] + 1;
		if(Math.isPrime(i) && lengths[i] === length) {
			result += i;
		}
	}
	return result;
};
console.log(solve(1000, 4));
