const primeFactors = (number) => {
	for(let i = 2; i < number; i ++) {
		if(number % i === 0) {
			return [...primeFactors(number / i), i];
		}
	}
	return [number];
};

const repeatingDecimalLength = (denominator) => {
	/*
	0). What is the largest number N (to 0.1 precision) such that N * 7 is less than 1?
	0.1 * 7 = 0.7 with 0.3 left over
	1). What is the largest number N (to 0.01 precision) such that N * 7 is less than 0.3?
	0.04 * 7 = 0.28 with 0.02 left over
	2). What is the largest number N (to 0.001 precision) such that N * 7 is less than 0.02?
	0.002 * 7 = 0.014 with 0.006 left over
	3). What is the largest number N (to 0.0001 precision) such that N * 7 is less than 0.006?
	0.0008 * 7 = 0.0056 with 0.0004 left over
	4). What is the largest number N (to 0.00001 precision) such that N * 7 is less than 0.0004?
	0.00005 * 7 = 0.00035 with 0.00005 left over
	5). What is the largest number N (to 0.000001 precision) such that N * 7 is less than 0.00005?
	0.000007 * 7 = 0.000049 with 0.00001 left over
	0.00001 is a multiple of ten from 0.1 (back in step #0) so the answer is 5 - 0 + 1 = 6.

	1/7 = 0.(142857) so the answer is correct.
	*/
	if(primeFactors(denominator).every(factor => factor === 2 || factor === 5)) {
		return 0;
	}
	let remainders = [1];
	while(true) {
		let nextDigit = 1;
		for(let i = 0; i * denominator < remainders.lastItem(); i += 0.1) {
			nextDigit = Math.round(i * 10);
		}
		const nextRemainder = (remainders.lastItem() * 10) - (nextDigit * denominator);
		if(remainders.includes(nextRemainder)) {
			return remainders.length - remainders.indexOf(nextRemainder);
		}
		remainders.push(nextRemainder);
	}
};

testing.addUnit("repeatingDecimalLength()", {
	"should return the length of the repeating part of the decimal": () => {
		expect(repeatingDecimalLength(2)).toEqual(0);
		expect(repeatingDecimalLength(3)).toEqual(1);
		expect(repeatingDecimalLength(4)).toEqual(0);
		expect(repeatingDecimalLength(5)).toEqual(0);
		expect(repeatingDecimalLength(6)).toEqual(1);
		expect(repeatingDecimalLength(7)).toEqual(6);
		expect(repeatingDecimalLength(8)).toEqual(0);
		expect(repeatingDecimalLength(14)).toEqual(6);
		expect(repeatingDecimalLength(30)).toEqual(1);
	}
});
testing.testUnit("repeatingDecimalLength()");

let longestCycle = 0;
let longestDenominator = 0;
for(let i = 2; i < 1000; i ++) {
	const cycleLength = repeatingDecimalLength(i);
	if(cycleLength > longestCycle) {
		longestCycle = cycleLength;
		longestDenominator = i;
	}
}
console.log(longestDenominator);
