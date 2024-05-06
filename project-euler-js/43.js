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

const isSubstringDivisible = (number) => {
	const PRIMES = [2, 3, 5, 7, 11, 13, 17];
	for(let i = 0; i < PRIMES.length; i ++) {
		const prime = PRIMES[i];
		const substring = `${number}`.substring(i + 1, i + 4);
		if(Number.parseInt(substring) % prime !== 0) {
			return false;
		}
	}
	return true;
};

console.time("solving the problem");
const ALL_DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
let sum = 0;
const factorial10 = factorial(10);
for(let i = 0; i < factorial10; i ++) {
	const permuation = nthPermutation(i, ALL_DIGITS);
	const number = Number.parseInt(permuation.join(""));
	if(isSubstringDivisible(number)) {
		sum += number;
	}
}
console.timeEnd("solving the problem");
