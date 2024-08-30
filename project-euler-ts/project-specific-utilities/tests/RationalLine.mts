import { describe, it } from "mocha";
import { RationalLine } from "../RationalLine.mjs";
import { RationalVector } from "../RationalVector.mjs";
import { assert } from "chai";
import { Rational } from "../../../utils-ts/modules/math/Rational.mjs";

describe("RationalLine.getX", () => {
	it("returns the x-value such that (x, y) is on the line, where y is the given y-value", () => {
		const line = new RationalLine(
			new RationalVector(new Rational(2), new Rational(1)), 
			new RationalVector(new Rational(3), new Rational(3))
		);
		const x = line.getX(new Rational(7));
		assert.deepEqual(x, new Rational(5));
	});
});
describe("RationalLine.getY", () => {
	it("returns the y-value such that (x, y) is on the line, where x is the given x-value", () => {
		const line = new RationalLine(
			new RationalVector(new Rational(1), new Rational(2)), 
			new RationalVector(new Rational(3), new Rational(3))
		);
		const x = line.getY(new Rational(7));
		assert.deepEqual(x, new Rational(5));
	});
});
describe("RationalLine.contains", () => {
	it("returns whether the line contain the point", () => {
		const line = new RationalLine(
			new RationalVector(new Rational(1), new Rational(2)),
			new RationalVector(new Rational(3), new Rational(4))
		);
		assert.isTrue(line.contains(new RationalVector(new Rational(0), new Rational(1))));
		assert.isFalse(line.contains(new RationalVector(new Rational(1), new Rational(1))));
	});
	it("works when the line is vertical", () => {
		const line = new RationalLine(
			new RationalVector(new Rational(1), new Rational(2)),
			new RationalVector(new Rational(1), new Rational(3))
		);
		assert.isTrue(line.contains(new RationalVector(new Rational(1), new Rational(4))));
		assert.isFalse(line.contains(new RationalVector(new Rational(2), new Rational(3))));
	});
});

describe("RationalLine.areCollinear", () => {
	it("returns true when the points are collinear", () => {
		assert.isTrue(RationalLine.areCollinear([
			new RationalVector(new Rational(1), new Rational(2)), 
			new RationalVector(new Rational(4), new Rational(1)), 
			new RationalVector(new Rational(7), new Rational(0))
		]));
	});
	it("returns false when the points are not collinear", () => {
		assert.isFalse(RationalLine.areCollinear([
			new RationalVector(new Rational(1), new Rational(2)), 
			new RationalVector(new Rational(4), new Rational(1)), 
			new RationalVector(new Rational(7), new Rational(1))
		]));
	});
});
describe("RationalLine.isPerpendicularTo", () => {
	it("returns true when the lines are perpendicular", () => {
		const line1 = new RationalLine(
			new RationalVector(new Rational(0), new Rational(0)),
			new RationalVector(new Rational(1), new Rational(2))
		);
		const line2 = new RationalLine(
			new RationalVector(new Rational(0), new Rational(0)),
			new RationalVector(new Rational(-2), new Rational(1))
		);
		assert.isTrue(line1.isPerpendicularTo(line2));
		assert.isTrue(line2.isPerpendicularTo(line1));
	});
	it("returns false when the lines are not perpendicular", () => {
		const line1 = new RationalLine(
			new RationalVector(new Rational(0), new Rational(0)),
			new RationalVector(new Rational(1), new Rational(3))
		);
		const line2 = new RationalLine(
			new RationalVector(new Rational(0), new Rational(0)),
			new RationalVector(new Rational(-2), new Rational(1))
		);
		assert.isFalse(line1.isPerpendicularTo(line2));
		assert.isFalse(line2.isPerpendicularTo(line1));
	});
	it("works when the lines are vertical and horizontal", () => {
		const line1 = new RationalLine(
			new RationalVector(new Rational(0), new Rational(0)),
			new RationalVector(new Rational(1), new Rational(0))
		);
		const line2 = new RationalLine(
			new RationalVector(new Rational(0), new Rational(0)),
			new RationalVector(new Rational(0), new Rational(1))
		);
		assert.isTrue(line1.isPerpendicularTo(line2));
		assert.isTrue(line2.isPerpendicularTo(line1));
		assert.isFalse(line1.isPerpendicularTo(line1));
		assert.isFalse(line2.isPerpendicularTo(line2));
	});
	it("returns false when one of the lines is vertical/horizontal and the other is not", () => {
		const vertical = new RationalLine(
			new RationalVector(new Rational(0), new Rational(0)),
			new RationalVector(new Rational(0), new Rational(1))
		);
		const horizontal = new RationalLine(
			new RationalVector(new Rational(0), new Rational(0)),
			new RationalVector(new Rational(1), new Rational(0))
		);
		const otherLine = new RationalLine(
			new RationalVector(new Rational(0), new Rational(0)),
			new RationalVector(new Rational(1), new Rational(1))
		);
		assert.isFalse(vertical.isPerpendicularTo(otherLine));
		assert.isFalse(otherLine.isPerpendicularTo(vertical));
		assert.isFalse(horizontal.isPerpendicularTo(otherLine));
		assert.isFalse(otherLine.isPerpendicularTo(horizontal));
	});
});
