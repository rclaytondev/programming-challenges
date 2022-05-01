class Rational {
	constructor(numerator, denominator = 1) {
		this.numerator = BigInt(numerator);
		this.denominator = BigInt(denominator);
	}

	simplify() {
		if(this.numerator === 0n) {
			return new Rational(0, 1);
		}
		const gcd = Math.gcd(this.numerator, this.denominator);
		const sign = Math.sign(Number(this.numerator)) * Math.sign(Number(this.denominator));
		return new Rational(sign * Math.abs(Number(this.numerator / gcd)), Math.abs(Number(this.denominator / gcd)));
	}

	add(rational) {
		const denominator = Math.lcm(this.denominator, rational.denominator);
		const numerator = (this.numerator * denominator / this.denominator) + (rational.numerator * denominator / rational.denominator);
		return new Rational(numerator, denominator);
	}

	reciprocal() {
		return new Rational(this.denominator, this.numerator);
	}
	sign() {
		if(this.numerator === 0) { return 0; }
		if(Math.sign(Number(this.numerator)) === Math.sign(Number(this.denominator))) { return 1; }
		return -1;
	}

	compareTo(rational) {
		const r1 = this.simplify();
		const r2 = rational.simplify();
		if(r1.sign() < r2.sign()) { return -1; }
		if(r1.sign() > r2.sign()) { return 1; }
		return Math.sign(Number(r1.numerator * r2.denominator - r1.denominator * r2.numerator)) * r1.sign();
	}
	equals(rational) {
		return this.compareTo(rational) === 0;
	}

	toString(mode = "default") {
		if(mode === "default") {
			return `${this.numerator}/${this.denominator}`
		}
		else if(mode === "pretty") {
			if(this.denominator == 1) { return `${this.numerator}`; }
			if(this.numerator == 0) { return `0`; }
			return `${this.numerator}/${this.denominator}`;
		}
	}
	toNumber() {
		return Number(this.numerator) / Number(this.denominator);
	}

	static min(...rationals) {
		let smallest = rationals[0];
		for(const rational of rationals.slice(1)) {
			if(rational.compareTo(smallest) < 0) {
				smallest = rational;
			}
		}
		return smallest;
	}
	static max(...rationals) {
		let largest = rationals[0];
		for(const rational of rationals.slice(1)) {
			if(rational.compareTo(largest) > 0) {
				largest = rational;
			}
		}
		return largest;
	}
}

testing.addUnit("Rational.simplify()", {
	"correctly simplifies fractions into their lowest terms": () => {
		const rational = new Rational(6, 15);
		const simplified = rational.simplify();
		expect(simplified.numerator).toEqual(2);
		expect(simplified.denominator).toEqual(5);
	},
	"correctly cancels negatives in the numerator and denominator": () => {
		const rational = new Rational(-2, -3);
		const simplified = rational.simplify();
		expect(simplified.numerator).toEqual(2);
		expect(simplified.denominator).toEqual(3);
	},
	"correctly moves negatives from the denominator to the numerator": () => {
		const rational = new Rational(2, -3);
		const simplified = rational.simplify();
		expect(simplified.numerator).toEqual(-2);
		expect(simplified.denominator).toEqual(3);
	},
	"sets the denominator to 1 when the numerator is zero": () => {
		const rational = new Rational(0, 5);
		const simplified = rational.simplify();
		expect(simplified.numerator).toEqual(0);
		expect(simplified.denominator).toEqual(1);
	}
});
testing.addUnit("Rational.compareTo()", [
	(a, b, c, d) => new Rational(a, b).compareTo(new Rational(c, d)),
	[1, 2, 3, 4, -1], // 1/2 < 3/4
	[3, 4, 3, 4, 0], // 3/4 = 3/4
	[3, 4, 1, 2, 1], // 3/4 > 1/2
	[1, 2, 2, 4, 0], // 1/2 = 2/4
	[-1, -2, -2, -4, 0], // (-1)/(-2) = (-2)/(-4)
	[-1, -2, 3, 4, -1], // (-1)/(-2) < 3/4
	[0, 1, 1, 2, -1] // 0/1 < 1/2
]);
testing.addUnit("Rational.min()", {
	"returns the smallest of the given rational numbers": () => {
		const rationals = [
			new Rational(0, 1),
			new Rational(3, 2),
			new Rational(1, 2)
		];
		const smallest = Rational.min(...rationals);
		expect(smallest).toEqual(new Rational(0, 1));
	}
});
testing.addUnit("Rational.max()", {
	"returns the smallest of the given rational numbers": () => {
		const rationals = [
			new Rational(0, 1),
			new Rational(3, 2),
			new Rational(1, 2)
		];
		const smallest = Rational.max(...rationals);
		expect(smallest).toEqual(new Rational(3, 2));
	}
});
