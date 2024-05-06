const fibonacci = (n => {
	if(n <= 2) { return BigInt(1); }
	return fibonacci(n - 1) + fibonacci(n - 2);
}).memoize(true);

const numDigitsInBigint = (bigint) => {
	let result = 0n;
	while(10n ** result <= bigint) {
		result ++;
	}
	return result;
};

for(let i = 0; i < Infinity; i ++) {
	const result = fibonacci(i);
	const numDigits = numDigitsInBigint(result);
	if(numDigits >= 1000) {
		console.log(i);
		break;
	}
}
