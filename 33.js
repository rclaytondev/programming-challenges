let answersFound = [];


const factors = (number) => {
	/* returns all the integers `number` is divisible by, including 1 and itself. */
	const factors = [];
	for(let i = 1; i <= number; i ++) {
		if(number % i === 0) {
			factors.push(i);
		}
	}
	return factors;
};
const greatestCommonFactor = (num1, num2) => {
	const factors1 = factors(num1);
	const factors2 = factors(num2);
	return factors1.reverse().find(factor => factors2.includes(factor));
};
const leastCommonFactor = (num1, num2) => {
	const factors1 = factors(num1);
	const factors2 = factors(num2);
	return factors1.find(factor => factor !== 1 && factors2.includes(factor));
};
const simplifyFraction = (numerator, denominator) => {
	const gcf = greatestCommonFactor(numerator, denominator);
	return [numerator / gcf, denominator / gcf];
};
const simplifications = (numerator, denominator) => {
	if(simplifyFraction(numerator, denominator).equals([numerator, denominator])) {
		return [];
	}
	const lcf = leastCommonFactor(numerator, denominator);
	return [[numerator / lcf, denominator / lcf], ...simplifications(numerator / lcf, denominator / lcf)];
};

for(let denominator = 10; denominator < 99; denominator ++) {
	for(let numerator = 10; numerator < denominator; numerator ++) {

	}
}
