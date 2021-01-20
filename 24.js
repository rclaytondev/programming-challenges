const factorial = (number) => {
	if(number <= 1) { return 1; }
	return factorial(number - 1) * number;
};

const nthPermutation = (n, objects) => {
	if(objects.length === 0) { return []; }
	if(objects.length === 1) { return [objects[0]]; }

	const firstDigit = objects[Math.floor(objects.length * (n / factorial(objects.length)))];
	return [
		firstDigit,
		...nthPermutation(
			n - (objects.indexOf(firstDigit) / objects.length * factorial(objects.length)),
			objects.filter(d => d !== firstDigit)
		)
	];
};
// console.log(nthPermutation(999999, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).join(""));
