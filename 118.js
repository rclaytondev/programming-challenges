const factorial = ((number) => {
	if(number <= 1) { return 1; }
	return factorial(number - 1) * number;
}).memoize(true);
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
const concatenate = (num1, num2) => Number.parseInt(`${num1}${num2}`);
const mergeStrings = (strings, binarySequence) => {
	expect(strings.length).toEqual(binarySequence.length + 1);
	let result = [strings[0]];
	for(let i = 0; i < binarySequence.length; i ++) {
		if(binarySequence[i] === "0") {
			result.push(strings[i + 1]);
		}
		else {
			result[result.length - 1] += strings[i + 1];
		}
	}
	return result;
};
const isPrime = ((num) => {
	if(num === 1) { return false; }
	const upperBound = Math.sqrt(num);
	for(let i = 2; i <= upperBound; i ++) {
		if(num % i === 0) { return false; }
	}
	return true;
}).memoize(true);


const pandigitalPrimeSets = (numDigits) => {
	/*
	Returns the number of distinct sets of numbers, where the set uses each digit once, and where all the elements are prime.
	*/
	let setsFound = 0;
	const digits = new Array(numDigits).fill(0).map((v, index) => index + 1);
	const numDigitsFactorial = factorial(digits.length);
	const waysToDividePermutation = 2 ** (numDigits - 1);
	for(let i = 0; i < numDigitsFactorial; i ++) {
		const digitPermutation = nthPermutation(i, digits);
		const permutationChars = digitPermutation.map(d => `${d}`);
		const lastDigit = digitPermutation.lastItem();
		if(lastDigit === 4 || lastDigit === 6 || lastDigit === 8) {
			continue;
		}
		else if(lastDigit === 2 || lastDigit === 5) {
			for(let j = 0; j < waysToDividePermutation; j += 2) {
				const binarySequence = j.toString(2).padStart(numDigits - 1, "0");
				const pandigitalArray = mergeStrings(permutationChars, binarySequence).map(s => Number.parseInt(s));
				if(pandigitalArray.every(num => isPrime(num))) {
					// console.log(pandigitalArray);
					setsFound += (1 / factorial(pandigitalArray.length));
				}
			}
		}
		else {
			for(let j = 0; j < waysToDividePermutation; j ++) {
				/*
				The 8-digit binary number `binarySequence` represents how to cut up the permutation to generate the pandigital array.
				Each bit represents whether to cut at that index or not (1 = no, 0 = yes).
				*/
				const binarySequence = j.toString(2).padStart(numDigits - 1, "0");
				const pandigitalArray = mergeStrings(permutationChars, binarySequence).map(s => Number.parseInt(s));
				if(pandigitalArray.every(num => isPrime(num))) {
					// console.log(pandigitalArray);
					setsFound += (1 / factorial(pandigitalArray.length));
				}
			}
		}

		if(i % 100 === 0) {
			console.log(`${(i / numDigitsFactorial * 100).toFixed(2)}%`);
		}
	}
	console.log(setsFound);
	return Math.round(setsFound); // rounding is only to remove floating-point inaccuracies; the result should always be nearly an integer already.
};

testing.addUnit("pandigitalPrimeSets()", [
	pandigitalPrimeSets,

	/* For 2 digits, there are no pandigital prime sets */
	[2, 0],

	/* For 3 digits, there are 2 pandigital prime sets: { 2, 13 } and { 2, 31 }. */
	[3, 2],

	/* For 4 digits, there are 9 pandigital prime sets: {1423}, {2143}, {2341}, {4321}, {2, 3, 41}, {23, 41}, {241, 3}, {2, 431}, and {3, 421} */
	[4, 9]
]);
testing.testAll();


console.time("finding prime sets");
console.log(pandigitalPrimeSets(9));
console.timeEnd("finding prime sets");
