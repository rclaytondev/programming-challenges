import { assert } from "chai";
import { Field, reals } from "../502-counting-castles/Field";
import { getArraySum } from "../utils-ts/Array";

export class Polynomial<FieldElementType> {
	field: Field<FieldElementType>;
	coefficients: FieldElementType[];
	constructor(field: Field<FieldElementType>, coefficients: FieldElementType[]) {
		this.field = field;
		this.coefficients = coefficients;
	}

	degree() {
		return this.coefficients.length - 1;
	}
	multiply(multiplier: FieldElementType | Polynomial<FieldElementType>) {
		if(multiplier instanceof Polynomial) {
			const coefficients = [];
			for(let exponent = 0; exponent <= this.degree() + multiplier.degree(); exponent ++) {
				let coefficient = this.field.zero;
				for(let exponent2 = 0; exponent2 <= exponent; exponent2 ++) {
					coefficient = this.field.add(coefficient, this.field.multiply((this.coefficients[exponent2] ?? this.field.zero), (multiplier.coefficients[exponent - exponent2] ?? this.field.zero)));
				}
				coefficients.push(coefficient);
			}
			return new Polynomial(this.field, coefficients).trimZeroes();
		}
		else {
			return new Polynomial(this.field, this.coefficients.map(c => this.field.multiply(c, multiplier))).trimZeroes();
		}
	}
	static multiply<FieldElementType>(...polynomials: Polynomial<FieldElementType>[]) {
		let result = new Polynomial(polynomials[0].field, [polynomials[0].field.one]);
		for(const polynomial of polynomials) {
			result = result.multiply(polynomial);
		}
		return result;
	}
	add(polynomial: Polynomial<FieldElementType>) {
		const coefficients = [];
		for(let i = 0; i < Math.max(this.coefficients.length, polynomial.coefficients.length); i ++) {
			coefficients[i] = this.field.add(this.coefficients[i] ?? this.field.zero, polynomial.coefficients[i] ?? this.field.zero);
		}
		return new Polynomial(this.field, coefficients).trimZeroes();
	}
	static sum<FieldElementType>(...polynomials: Polynomial<FieldElementType>[]) {
		let result = new Polynomial(polynomials[0].field, []);
		for(const polynomial of polynomials) {
			result = result.add(polynomial);
		}
		return result;
	}
	evaluate(input: FieldElementType) {
		return this.field.sum(...this.coefficients.map((coef, index) => this.field.multiply(coef, this.field.exponentiate(input, index))));
	}

	static interpolate<FieldElementType>(points: [FieldElementType, FieldElementType][], field: Field<FieldElementType>) {
		return Polynomial.sum(...points.map(([xValue, yValue], pointIndex) => {
			const otherPoints = points.filter((p, i) => i !== pointIndex);
			const basisPolynomial = Polynomial.multiply(...otherPoints.map(([x]) => new Polynomial(field, [field.opposite(x), field.one])));
			return basisPolynomial.multiply(field.divide(yValue, basisPolynomial.evaluate(xValue)));
		}));
	}

	trimZeroes() {
		while(this.coefficients[this.coefficients.length - 1] === this.field.zero) {
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
		const polynomial = Polynomial.interpolate(points, reals);
		assert.sameMembers(polynomial.coefficients, [3, 2]);
	});
	it("correctly interpolates a parabola", () => {
		const points = [
			[1, 1],
			[2, 4],
			[3, 9]
		] as [number, number][];
		const polynomial = Polynomial.interpolate(points, reals);
		assert.sameMembers(polynomial.coefficients, [0, 0, 1]);
	});
});
describe("Polynomial.multiply", () => {
	it("can multiply a polynomial by a number", () => {
		const polynomial = new Polynomial(reals, [1, 2, 3]);
		const result = polynomial.multiply(2);
		assert.sameMembers(result.coefficients, [2, 4, 6]);
	});
	it("can multiply a polynomial by another polynomial", () => {
		const result = new Polynomial(reals, [1, 1]).multiply(new Polynomial(reals, [1, 2]));
		assert.sameMembers(result.coefficients, [1, 3, 2]);
	});
});
