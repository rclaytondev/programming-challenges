const factorial = (number) => {
	if(number <= 1) { return 1; }
	return factorial(number - 1) * number;
};

const nthPermutation = (n, digits) => {
	if(digits.length === 1) { return [digits[0]]; }

	const firstDigit = digits[Math.floor(digits.length * (n / factorial(digits.length)))];
	return [
		firstDigit,
		...nthPermutation(
			n - (digits.indexOf(firstDigit) / digits.length * factorial(digits.length)),
			digits.filter(d => d !== firstDigit)
		)
	];
};
console.log(nthPermutation(999999, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).join(""));
