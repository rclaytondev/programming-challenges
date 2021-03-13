const getDivisors = (number) => {
	/* returns the set of integers the number is divisible by, including 1 and itself. */
	const upperBound = Math.sqrt(number);
	let divisors = new Set([1, number]);
	for(let i = 2; i <= upperBound; i ++) {
		if(number % i === 0) {
			divisors.add(i);
			divisors.add(number / i);
		}
	}
	return divisors;
};
const greatestCommonDivisor = (num1, num2) => {
	for(let i = Math.min(num1, num2); i > 1; i --) {
		if(num1 % i === 0 && num2 % i === 0) {
			return i;
		}
	}
	return 1;
};
const leastCommonDivisor = (num1, num2) => {
	for(let i = 2; i <= Math.min(num1, num2); i ++) {
		if(num1 % i === 0 && num2 % i === 0) {
			return i;
		}
	}
	return -1;
};

class Fraction {
	static parse(string) {
		const PARSER = /^(\d+)\s*\/\s*(\d+)$/g;
		const [, numeratorStr, denominatorStr] = PARSER.exec(string);
		return new Fraction(
			Number.parseInt(numeratorStr),
			Number.parseInt(denominatorStr)
		)
	}
	constructor(numerator, denominator) {
		this.numerator = numerator;
		this.denominator = denominator;
	}

	value() {
		return this.numerator / this.denominator;
	}

	multiply(fraction) {
		return new Fraction(
			this.numerator * fraction.numerator,
			this.denominator * fraction.denominator
		);
	}


	allSimplifications() {
		const divisors1 = getDivisors(this.numerator);
		const divisors2 = getDivisors(this.numerator);
		const divisors = divisors1.intersection(divisors2);
		return divisors.map(d => new Fraction(this.numerator / d, this.denominator / d));
	}
	simplify() {
		const gcd = greatestCommonDivisor(this.numerator, this.denominator);
		return new Fraction(this.numerator / gcd, this.denominator / gcd);
	}
	isSimplified() {
		return greatestCommonDivisor(this.numerator, this.denominator) === 1;
	}

	toString() {
		return `${this.numerator}/${this.denominator}`;
	}
}

testing.addUnit("Fraction.parse()", Fraction.parse, [
	["1/2", new Fraction(1, 2)],
	["3 / 4", new Fraction(3, 4)]
]);
testing.addUnit("Fraction.simplify()", [
	(fractionStr) => Fraction.parse(fractionStr).simplify().toString(),
	["10/20", "1/2"],
	["15/5", "3/1"],
	["3/4", "3/4"],
	["49/98", "1/2"]
]);
testing.addUnit("Fraction.allSimplifications()", [
	(fractionStr) => Fraction.parse(fractionStr).allSimplifications().map(f => f.toString()),
	[
		"15/30",
		new Set(["15/30", "5/10", "3/6", "1/2"])
	]
]);

const simplifyIncorrectly = (fraction) => {
	/*
	returns a fraction that is not necessarily equivalent to this one.
	*/
	const { numerator, denominator } = fraction;
	const digits1 = numerator.digits();
	const digits2 = denominator.digits();
	let result = null;
	if(digits1.some(d => digits2.includes(d))) {
		digits1.forEach((digit1, index1) => {
			digits2.forEach((digit2, index2) => {
				if(digit1 === digit2) {
					const otherDigits1 = digits1.filter((d, i) => i !== index1);
					const otherDigits2 = digits2.filter((d, i) => i !== index2);
					const simplifiedNumerator = Number.parseInt(otherDigits1.join(""));
					const simplifiedDenominator = Number.parseInt(otherDigits2.join(""));
					result = new Fraction(simplifiedNumerator, simplifiedDenominator);
				}
			});
		});
	}
	return result;
};

testing.addUnit("simplifyIncorrectly()", simplifyIncorrectly, [
	[
		new Fraction(49, 98),
		new Fraction(4, 8)
	],
	[
		new Fraction(36, 46),
		new Fraction(3, 4)
	],
	[
		new Fraction(18, 19),
		new Fraction(8, 9)
	],
	[
		new Fraction(52, 45),
		new Fraction(2, 4)
	]
]);

// testing.testAll();
testing.runTestByName("Fraction.allSimplifications() - test case 1");

const results = [];
for(let denominator = 11; denominator <= 99; denominator ++) {
	for(let numerator = 11; numerator < denominator; numerator ++) {
		if(numerator % 10 === 0 && denominator % 10 === 0) { continue; }
		const fraction = new Fraction(numerator, denominator);
		const incorrectSimplification = simplifyIncorrectly(fraction);
		if(incorrectSimplification?.value() === fraction?.value()) {
			console.log(`${numerator} / ${denominator} = ${incorrectSimplification.numerator} / ${incorrectSimplification.denominator}`);
			results.push(incorrectSimplification);
		}
	}
}
const product = results.reduce((a, c) => a.multiply(c));
