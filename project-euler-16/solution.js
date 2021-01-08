const digitOfPower = function(digitIndex, power) {
	/* returns the digit appearing at the index in 2^power. */
	if(power === 1) {
		/* base case: the number is 2^1 = 2. First (0th) digit is 2, all others are 0. */
		return (digitIndex === 0) ? 2 : 0;
	}
	if(digitIndex === 0) {
		/* the last digit of a power of 2 cycles through 2, 4, 8, and 6 */
		return [2, 4, 8, 6][(power - 1) % 4];
	}
	let result = (digitOfPower(digitIndex, power - 1) * 2) % 10;
	if(digitOfPower(digitIndex - 1, power - 1) >= 5) {
		result ++;
	}
	return result;
}.memoize(true);

testing.addUnit("digitOfPower()", {
	"should work for the last digit": () => {
		expect(digitOfPower(0, 1)).toEqual(2);
		expect(digitOfPower(0, 2)).toEqual(4);
		expect(digitOfPower(0, 3)).toEqual(8);
		expect(digitOfPower(0, 4)).toEqual(6);
		expect(digitOfPower(0, 5)).toEqual(2);
		expect(digitOfPower(0, 6)).toEqual(4);
	},
	"should work for the second digit": () => {
		expect(digitOfPower(1, 4)).toEqual(1); // 16
		expect(digitOfPower(1, 5)).toEqual(3); // 32
		expect(digitOfPower(1, 6)).toEqual(6); // 64
		expect(digitOfPower(1, 7)).toEqual(2); // 128
	}
});

const sumOfDigits = (power, numDigits) => {
	/*
	Returns the sum of the digits in 2^power.
	Relies on the number of digits having been pre-calculated (the `numDigits` parameter).
	*/
	let digitSum = 0;
	for(let i = 0; i < numDigits; i ++) {
		const digitValue = digitOfPower(i, power);
		digitSum += digitValue;
	}
	return digitSum;
};
const computePower = (power) => {
	/* computes the power of two by doing each digit individually. Just for testing; you can obviously just use Math.pow() instead. */
	const numDigits = Math.ceil(power / Math.log2(10));
	let num = "";
	for(let i = 0; i < numDigits; i ++) {
		const digit = digitOfPower(i, power);
		num = digit + num;
	}
	return Number.parseInt(num);
};

testing.addUnit("sumOfDigits()", {
	"test case 1 (sum of digits in 32)": () => {
		const result = sumOfDigits(5, 2); // 2^5=32 (2 digits)
		expect(result).toEqual(3 + 2);
	},
	"test case 2 (sum of digits in 128)": () => {
		const result = sumOfDigits(7, 3); // 2^7=128 (3 digits)
		expect(result).toEqual(1 + 2 + 8);
	},
	"test case 3 (sum of digits in 512)": () => {
		const result = sumOfDigits(9, 3); // 2^9=512 (3 digits)
		expect(result).toEqual(5 + 1 + 2);
	},
	"test case 4 (sum of digits in 1024)": () => {
		const result = sumOfDigits(10, 4); // 2^10=1024 (4 digits)
		expect(result).toEqual(1 + 0 + 2 + 4);
	},
	"test case 5 (sum of digits in 16384)": () => {
		const result = sumOfDigits(14, 5); // 2^14=16384 (5 digits)
		expect(result).toEqual(1 + 6 + 3 + 8 + 4);
	},
	"test case 6 (sum of digits in 65536)": () => {
		const result = sumOfDigits(16, 5); // 2^16=65536 (5 digits)
		expect(result).toEqual(6 + 5 + 5 + 3 + 6);
	},
});
testing.testAll();


console.log(sumOfDigits(1000, 302));
