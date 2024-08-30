import { Rational } from "../../utils-ts/modules/math/Rational.mjs";

export class RationalVector {
	x: Rational;
	y: Rational;

	constructor(x: Rational, y: Rational) {
		this.x = x;
		this.y = y;
	}

	equals(vector: RationalVector) {
		return this.x.equals(vector.x) && this.y.equals(vector.y);
	}
	toString() {
		return `(${this.x}, ${this.y})`;
	}

	multiply(scalar: Rational) {
		return new RationalVector(this.x.multiply(scalar), this.y.multiply(scalar));
	}
}
