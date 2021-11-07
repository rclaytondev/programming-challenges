class Factorization {
	/* Represents a rational number using its prime factorization. */
	constructor() {
		if(typeof arguments[0] === "number") {
			const [number] = arguments;
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
			return new Factorization(newExponents);
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
			return new Factorization(newExponents);
		}
	}

	toNumber(modulo = Infinity) {
		return Math.modularProduct(modulo, this.exponents.map((e, i) => {
			return Math.modularExponentiate(modulo, Sequence.PRIMES.nthTerm(i), e);
		}));
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
	}
});
testing.addUnit("Factorization.factorial()", {
	"can return a factorized representation of the factorial of a number": () => {
		const result = Factorization.factorial(4);
		expect(result.exponents).toEqual([3, 1]);
	}
});
