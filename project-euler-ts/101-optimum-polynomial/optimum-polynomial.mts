import { assert } from "chai";
import { getArraySum } from "../utils-ts/Array.mjs";

class Polynomial {
	coefficients: number[];
	constructor(coefficients: number[]) {
		this.coefficients = coefficients;
	}

	degree() {
		return this.coefficients.length - 1;
	}
	multiply(multiplier: number | Polynomial) {
		if(typeof multiplier === "number") {
			return new Polynomial(this.coefficients.map(c => c * multiplier)).trimZeroes();
		}
		else {
			const coefficients = [];
			for(let exponent = 0; exponent <= this.degree() + multiplier.degree(); exponent ++) {
				let coefficient = 0;
				for(let exponent2 = 0; exponent2 <= exponent; exponent2 ++) {
					coefficient += (this.coefficients[exponent2] ?? 0) * (multiplier.coefficients[exponent - exponent2] ?? 0);
				}
				coefficients.push(coefficient);
			}
			return new Polynomial(coefficients).trimZeroes();
		}
	}
	static multiply(...polynomials: Polynomial[]) {
		let result = new Polynomial([1]);
		for(const polynomial of polynomials) {
			result = result.multiply(polynomial);
		}
		return result;
	}
	add(polynomial: Polynomial) {
		const coefficients = [];
		for(let i = 0; i < Math.max(this.coefficients.length, polynomial.coefficients.length); i ++) {
			coefficients[i] = (this.coefficients[i] ?? 0) + (polynomial.coefficients[i] ?? 0);
		}
		return new Polynomial(coefficients).trimZeroes();
	}
	static sum(...polynomials: Polynomial[]) {
		let result = new Polynomial([]);
		for(const polynomial of polynomials) {
			result = result.add(polynomial);
		}
		return result;
	}
	evaluate(input: number) {
		return getArraySum(this.coefficients.map((coef, index) => coef * (input ** index)));
	}

	static interpolate(points: [number, number][]) {
		return Polynomial.sum(...points.map(([xValue, yValue], pointIndex) => {
			const otherPoints = points.filter((p, i) => i !== pointIndex);
			const basisPolynomial = Polynomial.multiply(...otherPoints.map(([x]) => new Polynomial([-x, 1])));
			return basisPolynomial.multiply(yValue / basisPolynomial.evaluate(xValue));
		}));
	}

	trimZeroes() {
		while(this.coefficients[this.coefficients.length - 1] === 0) {
			this.coefficients.pop();
		}
		return this;
	}
}

describe("Polynomial.interpolate", () => {
	it("correctly interpolates a line", () => {
		const points = [
			[3, 9],
			[5, 13]
		] as [number, number][];
		const polynomial = Polynomial.interpolate(points);
		assert.sameMembers(polynomial.coefficients, [3, 2]);
	});
	it("correctly interpolates a parabola", () => {
		const points = [
			[1, 1],
			[2, 4],
			[3, 9]
		] as [number, number][];
		const polynomial = Polynomial.interpolate(points);
		assert.sameMembers(polynomial.coefficients, [0, 0, 1]);
	});
});
describe("Polynomial.multiply", () => {
	it("can multiply a polynomial by a number", () => {
		const polynomial = new Polynomial([1, 2, 3]);
		const result = polynomial.multiply(2);
		assert.sameMembers(result.coefficients, [2, 4, 6]);
	});
	it("can multiply a polynomial by another polynomial", () => {
		const result = new Polynomial([1, 1]).multiply(new Polynomial([1, 2]));
		assert.sameMembers(result.coefficients, [1, 3, 2]);
	});
});

const POLYNOMIAL = new Polynomial([1, -1, 1, -1, 1, -1, 1, -1, 1, -1, 1]);
const solve = () => {
	let result = 0;
	for(let numTerms = 1; numTerms <= POLYNOMIAL.degree(); numTerms ++) {
		const terms = new Array(numTerms).fill(0).map((v, index) => [index + 1, POLYNOMIAL.evaluate(index + 1)] as [number, number]);
		const lagrangePolynomial = Polynomial.interpolate(terms);
		if(lagrangePolynomial.evaluate(numTerms + 1) !== POLYNOMIAL.evaluate(numTerms + 1)) {
			result += lagrangePolynomial.evaluate(numTerms + 1);
		}
	}
	return result;
};

// console.log(solve());
