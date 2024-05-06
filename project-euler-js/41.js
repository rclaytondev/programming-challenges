const nthPermutation = (n, objects) => {
	if(objects.length === 0) { return []; }
	if(objects.length === 1) { return [objects[0]]; }

	const firstObject = objects[Math.floor(objects.length * (n / factorial(objects.length)))];
	return [
		firstObject,
		...nthPermutation(
			n - (objects.indexOf(firstObject) / objects.length * factorial(objects.length)),
			objects.filter(d => d !== firstObject)
		)
	];
};
const factorial = ((number) => {
	if(number <= 1) { return 1; }
	return factorial(number - 1) * number;
}).memoize(true);

const isPrime = (number) => {
	const upperBound = Math.sqrt(number);
	if(number % 2 === 0) { return false; }
	for(let i = 3; i <= upperBound; i += 2) {
		if(number % i === 0) { return false; }
	}
	return true;
};


console.time("finding the answer");
outerLoop: for(let numDigits = 9; numDigits >= 1; numDigits --) {
	const digits = new Array(numDigits).fill().map((v, i) => i + 1);
	const lastPermutation = factorial(numDigits) - 1;
	for(let permutationIndex = lastPermutation; permutationIndex >= 0; permutationIndex --) {
		const permutation = nthPermutation(permutationIndex, digits);
		const pandigitalNumber = Number.parseInt(permutation.join(""));
		if(isPrime(pandigitalNumber)) {
			console.log(`the answer is ${pandigitalNumber}`);
			break outerLoop;
		}
	}
}
console.timeEnd("finding the answer");
