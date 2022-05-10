class Polynomial {
	constructor(coefficients) {
		if(Array.isArray(coefficients) && coefficients.every(v => typeof v === "number")) {
			this.coefficients = coefficients;
		}
		else if([...arguments].every(v => typeof v === "number")) {
			this.coefficients = [...arguments];
		}
		else {
			throw new Error(`Invalid input.`);
		}
	}

	toString() {
		const terms = [];
		for(const [power, coefficient] of this.coefficients.entries()) {
			let term = ``;
			if(coefficient === 0) { continue; }
			if(coefficient !== 1) { term += coefficient; }
			if(power !== 0) { term += `x`; }
			if(power > 1) { term += `^${power}`; }
			terms.push(term);
		}
		return terms.join(" + ");
	}

	add(polynomial) {
		let result = [];
		for(let i = 0; i < Math.max(this.coefficients.length, polynomial.coefficients.length); i ++) {
			const coef1 = this.coefficients[i] ?? 0;
			const coef2 = polynomial.coefficients[i] ?? 0;
			result[i] = coef1 + coef2;
		}
		return new Polynomial(result);
	}

	equals(polynomial) {
		for(let i = 0; i < Math.max(this.coefficients.length, polynomial.coefficients.length); i ++) {
			const coef1 = this.coefficients[i] ?? 0;
			const coef2 = polynomial.coefficients[i] ?? 0;
			if(coef1 !== coef2) { return false; }
		}
		return true;
	}
}

testing.addUnit("Polynomial.toString()", {
	"correctly writes the exponents": () => {
		const polynomial = new Polynomial([2, 3, 4]);
		expect(polynomial.toString()).toEqual(`2 + 3x + 4x^2`);
	},
	"correctly writes the coefficients": () => {
		const polynomial = new Polynomial([2, 0, 1]);
		expect(polynomial.toString()).toEqual(`2 + x^2`);
	}
});
testing.addUnit("Polynomial.add()", {
	"correctly adds the two polynomials": () => {
		const p1 = new Polynomial(1, 2, 3);
		const p2 = new Polynomial(4, 5, 6, 7);
		const sum = p1.add(p2);
		expect(sum.coefficients).toEqual([1+4, 2+5, 3+6, 7]); // 5, 7, 9, 7
	}
});
testing.addUnit("Polynomial.equals()", {
	"returns true when the polynomial's coefficients are equal": () => {
		const p1 = new Polynomial(1, 2, 3);
		const p2 = new Polynomial(1, 2, 3);
		expect(p1).toEqual(p2);
		expect(p2).toEqual(p1);
	},
	"returns true when the coefficients are equal, but one has more zeroes": () => {
		const p1 = new Polynomial(1, 2, 3, 0);
		const p2 = new Polynomial(1, 2, 3, 0, 0);
		expect(p1).toEqual(p2);
		expect(p2).toEqual(p1);
	},
	"returns false when the coefficients are different": () => {
		const p1 = new Polynomial(1, 2, 3);
		const p2 = new Polynomial(3, 2, 1);
		expect(p1).toNotEqual(p2);
		expect(p2).toNotEqual(p1);
	}
});
