import { MathUtils } from "../../../utils-ts/modules/math/MathUtils.mjs";

export class Polynomial {
	readonly coefficients: number[];
	constructor(coefficients: number[]) {
		this.coefficients = coefficients;
	}
	static monomial(degree: number, coefficient: number = 1) {
		const coefs = new Array(degree).fill(0);
		coefs[degree] = coefficient;
		return new Polynomial(coefs);
	}

	static sum(polynomials: Iterable<Polynomial>) {
		polynomials = [...polynomials];
		const degree = Math.max(...(polynomials as Polynomial[]).map(p => p.degree()));
		const coefs = [];
		for(let i = 0; i < degree; i ++) {
			coefs.push(MathUtils.sum((polynomials as Polynomial[]).map(p => p.coefficients[i] ?? 0)));
		}
		return new Polynomial(coefs).simplify();
	}
	add(polynomial: Polynomial) {
		return Polynomial.sum([this, polynomial]);
	}
	negate() {
		return new Polynomial(this.coefficients.map(c => -c));
	}
	subtract(polynomial: Polynomial) {
		return this.add(polynomial.negate());
	}

	degree() {
		return this.coefficients.findLastIndex(c => c !== 0) + 1;
	}

	simplify() {
		return new Polynomial(this.coefficients.slice(0, this.degree()));
	}
}
