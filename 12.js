const lcm = (numbers) => {
	/* returns the least common multiple of the numbers. */
	let result = 1;
	numbers.forEach(number => {
		for(let i = 1; i < Infinity; i ++) {
			if((result * i) % number === 0) {
				result *= i;
				break;
			}
		}
	});
	return result;
};
const leastWithNDivisors = (n) => {
	/* returns the smallest integer with N or more divisors (including 1 and the number itself) */
	let factors = [1];
	while(factors.length < n) {
		const nextNumber = smallestNotInArray(factors);
		factors.push(nextNumber);
		factors.forEach(factor => {
			if(areCoprime(factor, nextNumber) && !factors.includes(factor * nextNumber)) {
				factors.push(factor * nextNumber);
			}
		});
	}
	return lcm(factors);
};
const leastWithNDivisors2 = (n) => {
	for(let i = 0; i < Infinity; i ++) {
		if(numDivisors(i) >= n) {
			return i;
		}
	}
};

const smallestNotInArray = (array) => {
	/* returns the smallest positive integer that is not in the array. */
	for(let i = 1; i < Infinity; i ++) {
		if(!array.includes(i)) {
			return i;
		}
	}
};
const areCoprime = (num1, num2) => {
	let upperBound = Math.min(num1 / 2, num2 / 2);
	if(num1 === 1 || num2 === 1) {
		return true;
	}
	if(num1 % num2 === 0 || num2 % num1 === 0) {
		return false;
	}
	for(let i = 2; i <= upperBound; i ++) {
		if(num1 % i === 0 && num2 % i === 0) {
			return false;
		}
	}
	return true;
};

testing.addUnit("lcm()", lcm, [
	[[1], 1],
	[[1, 2], 2],
	[[1, 2, 3], 6],
	[[1, 2, 3, 4], 12],
	[[1, 2, 3, 4, 5], 60],
	[[1, 2, 3, 4, 5, 6], 60],

	[[3, 5], 15],
	[[7, 4], 28],
	[[10, 2], 10]
]);
testing.addUnit("leastWithNDivisors()", leastWithNDivisors, [
	[1, 1],
	[2, 2],
	[3, 4],
	[4, 6],
	[5, 12],
	[6, 12],
	[7, 24]
]);
testing.addUnit("smallestNotInArray()", smallestNotInArray, [
	[[1, 2, 3], 4],
	[[2, 3, 4], 1],
	[[8, 2, 6, 1, 3, 5], 4]
]);
testing.addUnit("areCoprime()", areCoprime, [
	[1, 2, true],
	[5, 6, true],
	[2, 4, false],
	[3, 9, false],
	[17, 23, true],
	[5, 15, false]
]);
// testing.runTestByName("leastWithNDivisors() - test case 3");


const numDivisors = (number) => {
	let divisors = 0;
	for(let i = 1; i <= number; i ++) {
		if(number % i === 0) { divisors ++; }
	}
	return divisors;
};


testing.testAll();
