class Line {
	constructor(point1, point2) {
		if(arguments.length === 4 && [...arguments].every(arg => typeof arg === "number")) {
			const [x1, y1, x2, y2] = arguments;
			this.point1 = new Vector(x1, y1);
			this.point2 = new Vector(x2, y2);
		}
		else {
			this.point1 = point1;
			this.point2 = point2;
		}
	}

	display(c) {
		/* displays the line on the canvas. */
		const canvasDiagonalLength = Math.hypot(c.canvas.width, c.canvas.height);
		const center = this.center();
		c.strokeLine(
			this.point1.scaleAbout(center, canvasDiagonalLength / this.length() * 2),
			this.point2.scaleAbout(center, canvasDiagonalLength / this.length() * 2)
		);
	}
	displaySegment(c) {
		c.strokeLine(this.point1, this.point2);
	}
	displayEndPoints(c, dotSize = 5) {
		c.fillCircle(this.point1.x, this.point1.y, dotSize);
		c.fillCircle(this.point2.x, this.point2.y, dotSize);
	}


	intersection(line) {
		/* returns the intersection of this line and the given line. (Both lines are assumed to be infinitely long.) */
		if(this.point2.x === this.point1.x || line.point2.x === line.point1.x) {
			/* special cases for vertical lines */
			if(this.point2.x === this.point1.x && line.point2.y === line.point1.y) {
				/* this line is vertical and the other line is horizontal */
				return new Vector(this.point1.x, line.point2.y);
			}
			if(line.point2.x === line.point1.x && this.point2.y === this.point1.y) {
				/* the other line is vertical and this line is horizontal */
				return new Vector(line.point1.x, this.point2.y);
			}
			/* a line is vertical (undefined slope, oh no!). switch x and y values (making it horizontal), calculate, and then switch x and y again to cancel out. */
			const line1 = new Line(new Vector(this.point1.y, this.point1.x), new Vector(this.point2.y, this.point2.x));
			const line2 = new Line(new Vector(line.point1.y, line.point1.x), new Vector(line.point2.y, line.point2.x));
			const result = line1.intersection(line2);
			if(result == null) { return result; }
			[result.x, result.y] = [result.y, result.x];
			return result;
		}

		/* convert to slope-intercept form to make calculations easier */
		var slope1 = (this.point2.y - this.point1.y) / (this.point2.x - this.point1.x);
		var slope2 = (line.point2.y - line.point1.y) / (line.point2.x - line.point1.x);
		if(slope1 === slope2) {
			return null; // lines are paralell - no intersection
		}
		var intercept1 = this.point1.y - (slope1 * this.point1.x);
		var intercept2 = line.point1.y - (slope2 * line.point1.x);

		/* solve equations */
		var xValue = (intercept2 - intercept1) / (slope1 - slope2)
		return new Vector(
			xValue,
			(slope1 * xValue) + intercept1
		);
	}
	intersectsSegment(segment) {
		/* returns the intersection of this infinite line and the given finite segment. */
		const intersection = this.intersection(segment);
		if(intersection == null) { return null; }
		if(
			intersection.x.isBetween(segment.point1.x, segment.point2.x, 1e-6) &&
			intersection.y.isBetween(segment.point1.y, segment.point2.y, 1e-6)
		) {
			return intersection;
		}
		return null;
	}
	segmentIntersection() {
		/* returns the intersection of the two finite line segments. */
	}

	angle() {
		/* returns the angle of this line in degrees, counterclockwise from the rightward direction, between 0 and 360. */
		const displacement = this.point2.subtract(this.point1);
		return Math.modulateIntoRange(Math.toDegrees(Math.atan2(-displacement.y, displacement.x)), 0, 360);
	}
	center() {
		return new Vector(
			(this.point1.x + this.point2.x) / 2,
			(this.point1.y + this.point2.y) / 2
		);
	}
	length() {
		return this.point1.distanceFrom(this.point2);
	}
	slope() {
		return (this.point2.y - this.point1.y) / (this.point2.x - this.point1.x);
	}
	yIntercept() {
		const slope = this.slope();
		if(slope === Infinity || slope === -Infinity) {
			return null;
		}
	}
}

testing.addUnit("Line.intersection()", {
	"correctly calculates intersection in the general case - test case 1": () => {
		const line1 = new Line(0, 0, 1, 1); // y = x
		const line2 = new Line(0, 10, 1, 9); // y = -x + 10
		const intersection = line1.intersection(line2);
		expect(intersection).toEqual(new Vector(5, 5));
	},
	"correctly calculates intersection in the general case - test case 2": () => {
		const line1 = new Line(0, 0, 1, 0); // y = 0
		const line2 = new Line(0, 10, 1, 9); // y = -x + 10
		const intersection = line1.intersection(line2);
		expect(intersection).toEqual(new Vector(10, 0));
	},
	"correctly determines paralell lines have no intersection": () => {
		const line1 = new Line(0, 0, 1, 1); // y = x
		const line2 = new Line(0, 10, 1, 11); // y = x + 10
		const intersection = line1.intersection(line2);
		expect(intersection).toEqual(null);
	},
	"correctly determines paralell vertical lines have no intersection": () => {
		const line1 = new Line(0, 0, 0, 1);
		const line2 = new Line(5, 0, 5, 1);
		const intersection = line1.intersection(line2);
		expect(intersection).toEqual(null);
	},
	"correctly calculates intersection of vertical and horizontal lines": () => {
		const line1 = new Line(0, 0, 0, 1);
		const line2 = new Line(0, 0, 1, 0);
		const intersection1 = line1.intersection(line2);
		const intersection2 = line2.intersection(line1);
		expect(intersection1).toEqual(new Vector(0, 0));
		expect(intersection2).toEqual(new Vector(0, 0));
	}
});
testing.addUnit("Line.angle()", {
	"correctly determines angle - test case 1": () => {
		const line = new Line(
			new Vector(0, 0),
			new Vector(1, -1)
		);
		expect(line.angle()).toApproximatelyEqual(45);
	},
	"correctly determines angle - test case 2": () => {
		const line = new Line(
			new Vector(0, 0),
			new Vector(0, -1)
		);
		expect(line.angle()).toApproximatelyEqual(90);
	},
	"correctly determines angle - test case 3": () => {
		const line = new Line(
			new Vector(0, 0),
			new Vector(-1, 0)
		);
		expect(line.angle()).toApproximatelyEqual(180);
	},
	"correctly determines angle - test case 4": () => {
		const line = new Line(
			new Vector(0, 0),
			new Vector(0, 1)
		);
		expect(line.angle()).toApproximatelyEqual(270);
	}
});
