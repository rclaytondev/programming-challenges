class Factorization {
	/* Represents a rational number using its prime factorization. */
	constructor() {
		if(typeof arguments[0] === "number") {
			const [number] = arguments;
			if(number == 0) {
				this.sign = 0;
				this.exponents = [];
				return;
			}
			const factorized = Math.factorize(Math.abs(number), "prime-exponents");
			this.exponents = [];
			this.sign = Math.sign(number);
			if(number !== 0) {
				for(let [prime, exponent] of Object.entries(factorized)) {
					prime = Number.parseInt(prime);
					this.exponents[Sequence.PRIMES.indexOf(prime)] = exponent;
				}
				for(const [i, exponent] of this.exponents.entries()) {
					if(typeof exponent !== "number") {
						this.exponents[i] = 0;
					}
				}
			}
		}
		else if(Array.isArray(arguments[0])) {
			const [exponents, sign] = arguments;
			this.exponents = exponents;
			this.sign = sign ?? 1;
		}
	}

	divide() {
		if(typeof arguments[0] === "number") {
			const [number] = arguments;
			return this.divide(new Factorization(number));
		}
		else {
			const [factorization] = arguments;
			const newExponents = [];
			for(let i = 0; i < Math.max(this.exponents.length, factorization.exponents.length); i ++) {
				newExponents[i] = (this.exponents[i] ?? 0) - (factorization.exponents[i] ?? 0);
			}
			return new Factorization(newExponents, this.sign * factorization.sign);
		}
	}
	multiply() {
		if(typeof arguments[0] === "number") {
			const [number] = arguments;
			return this.multiply(new Factorization(number));
		}
		else {
			const [factorization] = arguments;
			const newExponents = [];
			for(let i = 0; i < Math.max(this.exponents.length, factorization.exponents.length); i ++) {
				newExponents[i] = (this.exponents[i] ?? 0) + (factorization.exponents[i] ?? 0);
			}
			return new Factorization(newExponents, this.sign * factorization.sign);
		}
	}
	add() {
		if(typeof arguments[0] === "number") {
			const [number] = arguments;
			return this.add(new Factorization(number));
		}
		else {
			const [factorization] = arguments;
			const num1 = this.numerator();
			const denom1 = this.denominator();
			const num2 = factorization.numerator();
			const denom2 = factorization.denominator();
			const newDenominator = denom1.multiply(denom2);
			const newNumerator = new Factorization(
				(num1.multiply(denom2).toNumber() + num2.multiply(denom1).toNumber())
			);
			return newNumerator.divide(newDenominator);
		}
	}
	subtract() {
		if(typeof arguments[0] === "number") {
			return this.add(-arguments[0]);
		}
		else {
			const [factorization] = arguments;
			return this.add(new Factorization(factorization.exponents, -factorization.sign));
		}
	}
	reciprocal() {
		return new Factorization(this.exponents.map(e => -e), this.sign);
	}

	numerator() {
		return new Factorization(this.exponents.map(v => Math.max(v, 0)), this.sign);
	}
	denominator() {
		return new Factorization(this.exponents.map(v => -Math.min(v, 0)));
	}

	lcm(factorization) {
		return new Factorization(
			new Array(Math.max(this.exponents.length, factorization.exponents.length))
			.fill()
			.map((v, i) => Math.max(this.exponents[i] ?? 0, factorization.exponents[i] ?? 0))
		);
	}

	toNumber(modulo = Infinity) {
		return Math.modularProduct(modulo, [this.sign, ...this.exponents.map((e, i) => {
			return Math.modularExponentiate(modulo, Sequence.PRIMES.nthTerm(i), e);
		})]);
	}

	isInteger() {
		return this.exponents.every(v => v >= 0);
	}

	static factorial(number) {
		let exponents = [];
		for(const prime of Sequence.PRIMES.termsBelow(number, true)) {
			exponents.push(0);
			for(let i = 1; prime ** i <= number; i ++) {
				exponents[exponents.length - 1] += Math.floor(number / (prime ** i));
			}
		}
		return new Factorization(exponents);
	}

	toString(format = "default") {
		if(this.sign === 0) { return "0"; }
		if(this.exponents.every(v => v == 0)) { return "1"; }

		if(format === "default") {
			const result = this.exponents.map((exponent, i) => {
				const prime = Sequence.PRIMES.nthTerm(i);
				if(exponent >= 0) {
					return `${prime}^${exponent}`;
				}
				else {
					return `${prime}^(${exponent})`;
				}
			}).join(" * ");
			return (this.sign > 0) ? result : `-${result}`;
		}
		else if(format === "pretty") {
			const toString = (factorization) => (
				factorization.exponents
				.map((exponent, i) => {
					const prime = Sequence.PRIMES.nthTerm(i);
					if(exponent === 0) { return ""; }
					if(exponent === 1) { return prime; }
					return `${prime}^${exponent}`;
				})
				.filter(v => v !== "")
				.join(" * ")
			);

			const numerator = this.numerator();
			const denominator = this.denominator();
			let result;
			if(denominator.exponents.every(v => v === 0)) {
				result = toString(numerator);
			}
			else if(numerator.exponents.every(v => v === 0)) {
				result = `1 / (${toString(denominator)})`;
			}
			else {
				result = `(${toString(numerator)}) / (${toString(denominator)})`;
			}
			return (this.sign > 0) ? `${result}` : `-${result}`;
		}
		else if(format === "rational") {
			return `${this.numerator().toNumber()}/${this.denominator().toNumber()}`;
		}
	}
}

testing.addUnit("Factorization constructor", {
	"can create a Factorization from a Number": () => {
		const result = new Factorization(340);
		expect(result.exponents).toEqual([2, 0, 1, 0, 0, 0, 1]);
		expect(result.sign).toEqual(1);
	},
	"can create a Factorization from a negative Number": () => {
		const result = new Factorization(-340);
		expect(result.exponents).toEqual([2, 0, 1, 0, 0, 0, 1]);
		expect(result.sign).toEqual(-1);
	},
	"can create a Factorization from the number 0": () => {
		const result = new Factorization(0);
		expect(result.exponents).toEqual([]);
		expect(result.sign).toEqual(0);
	},
	"can create a Factorization from a list of exponents": () => {
		const result = new Factorization([2, 0, 1, 0, 0, 0, 1]);
		expect(result.exponents).toEqual([2, 0, 1, 0, 0, 0, 1]);
	},
	"can create a Factorization from a list of exponents and a sign": () => {
		const result = new Factorization([], -1);
		expect(result.exponents).toEqual([]);
		expect(result.sign).toEqual(-1);
	}
});
testing.addUnit("Factorization.divide()", {
	"can divide by another Factorization": () => {
		const f1 = new Factorization([1, 2, 0, 1]);
		const f2 = new Factorization([1, 1, 0, 0]);
		const quotient = f1.divide(f2);
		expect(quotient.exponents).toEqual([0, 1, 0, 1]);
	},
	"can divide by a number": () => {
		const factorization = new Factorization([3, 1, 0, 2]);
		const quotient = factorization.divide(4);
		expect(quotient.exponents).toEqual([1, 1, 0, 2]);
	},
	"returns a negative number when the signs are opposite": () => {
		const f1 = new Factorization([1, 2, 3], 1);
		const f2 = new Factorization([4, 5, 6], -1);
		const quotient = f1.divide(f2);
		expect(quotient.sign).toEqual(-1);
	}
});
testing.addUnit("Factorization.multiply()", {
	"can multiply by another Factorization": () => {
		const f1 = new Factorization([1, 2, 1, 0, 3]);
		const f2 = new Factorization([5, 3]);
		const product = f1.multiply(f2);
		expect(product.exponents).toEqual([6, 5, 1, 0, 3]);
	},
	"can multiply by a number": () => {
		const f1 = new Factorization([1, 2, 1, 0, 3]);
		const product = f1.multiply(864);
		expect(product.exponents).toEqual([6, 5, 1, 0, 3]);
	},
	"returns a negative number when the signs are opposite": () => {
		const f1 = new Factorization([1, 2, 3], 1);
		const f2 = new Factorization([4, 5, 6], -1);
		const product = f1.multiply(f2);
		expect(product.sign).toEqual(-1);
	}
});
testing.addUnit("Factorization.toNumber()", {
	"can convert a Factorization to a number": () => {
		const factorization = new Factorization([4, 1, 3]);
		const number = factorization.toNumber();
		expect(number).toEqual(6000);
	},
	"can return the result in modular arithmetic": () => {
		const factorization = new Factorization([3, 0, 0, 5]);
		const number = factorization.toNumber(1000);
		expect(number).toEqual(456);
	},
	"works for negative numbers": () => {
		const factorization = new Factorization([4, 1, 3], -1);
		const number = factorization.toNumber();
		expect(number).toEqual(-6000);
	}
});
testing.addUnit("Factorization.factorial()", {
	"can return a factorized representation of the factorial of a number": () => {
		const result = Factorization.factorial(4);
		expect(result.exponents).toEqual([3, 1]);
	}
});
testing.addUnit("Factorization.numerator()", {
	"correctly returns the numerator": () => {
		const factorization = new Factorization([4, 2, -5, 3, -7, -9]);
		const numerator = factorization.numerator();
		expect(numerator).toEqual(new Factorization([4, 2, 0, 3, 0, 0]));
	},
	"returns the numerator with the same sign as the Factorization": () => {
		const factorization = new Factorization([1, -2, 3], -1);
		const numerator = factorization.numerator();
		expect(numerator).toEqual(new Factorization([1, 0, 3], -1));
	}
});
testing.addUnit("Factorization.denominator()", {
	"correctly returns the denominator": () => {
		const factorization = new Factorization([4, 2, -5, 3, -7, -9]);
		const denominator = factorization.denominator();
		expect(denominator).toEqual(new Factorization([0, 0, 5, 0, 7, 9]));
	},
	"returns the denominator with a positive sign": () => {
		const factorization = new Factorization([1, -2, 3], -1);
		const denominator = factorization.denominator();
		expect(denominator).toEqual(new Factorization([0, 2, 0], 1));
	}
});
testing.addUnit("Factorization.lcm()", {
	"correctly calculates the LCM of the two Factorizations": () => {
		const f1 = new Factorization([1, 2, 3, 2, 1]);
		const f2 = new Factorization([3, 2, 1, 2, 3]);
		const lcm = f1.lcm(f2);
		expect(lcm).toEqual(new Factorization([3, 2, 3, 2, 3]));
	}
});
testing.addUnit("Factorization.add()", {
	"can add two Factorizations of integers": () => {
		const f1 = new Factorization(12);
		const f2 = new Factorization(17);
		const sum = f1.add(f2);
		expect(sum.toNumber()).toEqual(29);
	},
	"can add two Factorizations of rational numbers": () => {
		const f1 = new Factorization([3, -1, -1]); // 8/15
		const f2 = new Factorization([2, -1, 1]); // 20/3
		const sum = f1.add(f2);
		expect(sum.exponents).toEqual([2, 2, -1]); // 36/5
		expect(sum.sign).toEqual(1);
	}
});
testing.addUnit("Factorization.subtract()", {
	"can subtract two Factorizations of integers": () => {
		const f1 = new Factorization(12);
		const f2 = new Factorization(17);
		const difference = f1.subtract(f2);
		expect(difference.toNumber()).toEqual(-5);
	},
	"can subtract two Factorizations of rational numbers": () => {
		const f1 = new Factorization([3, -1, -1]); // 8/15
		const f2 = new Factorization([2, -1, 1]); // 20/3
		const difference = f1.subtract(f2);
		expect(difference.exponents).toEqual([2, -1, -1, 0, 0, 0, 0, 0, 1]); // -92/15
		expect(difference.sign).toEqual(-1);
	}
});
testing.addUnit("Factorization.isInteger()", {
	"returns true for integers": () => {
		const factorization = new Factorization([3, 0, 5, 1]);
		expect(factorization.isInteger()).toEqual(true);
	},
	"returns false for non-integers": () => {
		const factorization = new Factorization([3, 0, -5, 1]);
		expect(factorization.isInteger()).toEqual(false);
	},
});
testing.addUnit("Factorization.toString()", {
	"can convert it to a string in the default format": () => {
		const result = new Factorization([1, 2, 0, -3]);
		const string = result.toString();
		expect(string).toEqual(`2^1 * 3^2 * 5^0 * 7^(-3)`);
	},
	"can convert negative numbers to a string in the default format": () => {
		const result = new Factorization([1, 2, 0, -3], -1);
		const string = result.toString();
		expect(string).toEqual(`-2^1 * 3^2 * 5^0 * 7^(-3)`);
	},

	"can convert it to a string in the pretty format": () => {
		const result = new Factorization([1, 2, 0, -3]);
		const string = result.toString("pretty");
		expect(string).toEqual(`(2 * 3^2) / (7^3)`);
	},
	"can convert negative numbers to a string in the pretty format": () => {
		const result = new Factorization([1, 2, 0, -3], -1);
		const string = result.toString("pretty");
		expect(string).toEqual(`-(2 * 3^2) / (7^3)`);
	},
	"can convert an integer to a string in the pretty format": () => {
		const result = new Factorization([1, 2]);
		const string = result.toString("pretty");
		expect(string).toEqual(`2 * 3^2`);
	},
	"can convert a unit fraction to a string in the pretty format": () => {
		const result = new Factorization([-1, -2]);
		const string = result.toString("pretty");
		expect(string).toEqual(`1 / (2 * 3^2)`);
	},

	"can convert it to a string in the rational number format": () => {
		const result = new Factorization([1, 2, 0, -3]);
		const string = result.toString("rational");
		expect(string).toEqual(`18/343`);
	},
	"can convert negative numbers to a string in the rational number format": () => {
		const result = new Factorization([1, 2, 0, -3], -1);
		const string = result.toString("rational");
		expect(string).toEqual(`-18/343`);
	}
});
