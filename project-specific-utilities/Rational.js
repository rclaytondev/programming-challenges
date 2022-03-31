class Rational {
	constructor(numerator, denominator = 1) {
		this.numerator = BigInt(numerator);
		this.denominator = BigInt(denominator);
	}

	simplify() {
		const gcd = Math.gcd(this.numerator, this.denominator);
		return new Rational(this.numerator / gcd, this.denominator / gcd);
	}

	add(rational) {
		const denominator = Math.lcm(this.denominator, rational.denominator);
		const numerator = (this.numerator * denominator / this.denominator) + (rational.numerator * denominator / rational.denominator);
		return new Rational(numerator, denominator);
	}

	reciprocal() {
		return new Rational(this.denominator, this.numerator);
	}

	toString() {
		return `${this.numerator}/${this.denominator}`
	}
}
