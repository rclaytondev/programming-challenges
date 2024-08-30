import { Rational } from "../../utils-ts/modules/math/Rational.mjs";
import { RationalVector } from "./RationalVector.mjs";

export class RationalLine {
	endpoint1: RationalVector;
	endpoint2: RationalVector;

	constructor(endpoint1: RationalVector, endpoint2: RationalVector) {
		this.endpoint1 = endpoint1;
		this.endpoint2 = endpoint2;
	}

	getX(y: Rational) {
		return this.endpoint1.x.add((y.subtract(this.endpoint1.y)).divide(this.endpoint2.y.subtract(this.endpoint1.y)).multiply(this.endpoint2.x.subtract(this.endpoint1.x)));
	}
	getY(x: Rational) {
		return this.endpoint1.y.add((x.subtract(this.endpoint1.x)).divide(this.endpoint2.x.subtract(this.endpoint1.x)).multiply(this.endpoint2.y.subtract(this.endpoint1.y)));
	}

	scale(num: Rational) {
		return new RationalLine(this.endpoint1.multiply(num), this.endpoint2.multiply(num));
	}

	isHorizontal() {
		return this.endpoint1.y.equals(this.endpoint2.y);
	}
	isVertical() {
		return this.endpoint1.x.equals(this.endpoint2.x);
	}

	contains(point: RationalVector) {
		if(this.isVertical()) {
			return point.x.equals(this.endpoint1.x);
		}
		return this.getY(point.x).equals(point.y);
	}

	slope() {
		const changeInY = this.endpoint1.y.subtract(this.endpoint2.y);
		const changeInX = this.endpoint1.x.subtract(this.endpoint2.x);
		return changeInY.divide(changeInX);
	}

	isPerpendicularTo(line: RationalLine) {
		if(this.isVertical()) { return line.isHorizontal(); }
		if(this.isHorizontal()) { return line.isVertical(); }
		if(line.isHorizontal() || line.isVertical()) { return false; }
		return this.slope().equals(new Rational(-1).divide(line.slope()));
	}

	static areCollinear(points: RationalVector[]) {
		if(points.length <= 2) { return true; }
		const [p1, p2, ...others] = points;
		const line = new RationalLine(p1, p2);
		return others.every(p => line.contains(p));
	}
}
