const getDigits = (number) => [...`${number}`].map(digit => Number.parseInt(digit));
const rotateArray = array => array.map((v, index) => array[(index + 1) % array.length]);
const allRotations = (number => {
	const digits = getDigits(number);
	let rotations = [digits];
	while(rotations.length < digits.length) {
		rotations.push(rotateArray(rotations.lastItem()));
	}
	return new Set(rotations.map(r => Number.parseInt(r.join(""))));
});
testing.addUnit("allRotations", allRotations, [
	[12, new Set([12, 21])],
	[123, new Set([123, 231, 312])]
]);
testing.testAll();

const isPrime = (n => {
	if(n <= 1) { return false; }
	if(n % 2 === 0) { return false; }
	const upperBound = Math.sqrt(n);
	for(let i = 3; i <= upperBound; i += 2) {
		if(n % i === 0){
			return false;
		}
	}
	return true;
}).memoize(true);

const circularPrimesBelow = (upperBound) => {
	let numCircularPrimes = 4; // one-digit primes (2, 3, 5, 7) are already counted. (Assumes the upper bound is > 10).
	const ILLEGAL_DIGITS = [0, 2, 4, 5, 6, 8];
	for(let i = 11; i < upperBound; i += 2) { // += 2 because only odd numbers can be prime
		const digits = getDigits(i);
		if(digits.some(d => ILLEGAL_DIGITS.includes(d))) {
			/*
			if the number contains an illegal digit, skip to the next number not containing the digit.
			e.g. if you reach 136000, you can skip all the way to 137000 because all the numbers you skipped will contain a 6 and therefore not be a circular prime.
			*/
			const illegalDigitIndex = digits.findIndex(d => ILLEGAL_DIGITS.includes(d));
			const numberBefore = Math.floor(i / (10 ** (digits.length - illegalDigitIndex))) * (10 ** (digits.length - illegalDigitIndex));
			const skipToIndex = numberBefore + (digits[illegalDigitIndex] + 1) * (10 ** (digits.length - illegalDigitIndex - 1)) - 1;
			i = skipToIndex;
			continue;
		}

		const rotations = allRotations(i);
		if(rotations.every(r => isPrime(r))) {
			numCircularPrimes ++;
		}
	}
	return numCircularPrimes;
};

console.time("solving the problem");
console.log(circularPrimesBelow(1000000));
console.timeEnd("solving the problem");
