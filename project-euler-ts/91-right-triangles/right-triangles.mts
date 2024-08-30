import { Line } from "../../utils-ts/modules/geometry/Line.mjs";
import { Vector } from "../../utils-ts/modules/geometry/Vector.mjs";
import { Rational } from "../../utils-ts/modules/math/Rational.mjs";
import { RationalLine } from "../project-specific-utilities/RationalLine.mjs";
import { RationalVector } from "../project-specific-utilities/RationalVector.mjs";

class Triangle {
	vertices: [RationalVector, RationalVector, RationalVector];

	constructor(vertices: [RationalVector, RationalVector, RationalVector]) {
		this.vertices = vertices;
	}

	edges() {
		return [
			new RationalLine(this.vertices[0], this.vertices[1]),
			new RationalLine(this.vertices[1], this.vertices[2]),
			new RationalLine(this.vertices[2], this.vertices[0]),
		];
	}

	isDegenerate() {
		const [v1, v2, v3] = this.vertices;
		if(v1.equals(v2) || v1.equals(v3) || v2.equals(v3)) {
			return true;
		}
		return RationalLine.areCollinear(this.vertices);
	}
	isRight() {
		const [e1, e2, e3] = this.edges();
		return e1.isPerpendicularTo(e2) || e2.isPerpendicularTo(e3) || e3.isPerpendicularTo(e1);
	}
}

const pointsInSquare = function*(maxCoordinate: number) {
	for(let x = 0; x <= maxCoordinate; x ++) {
		for(let y = 0; y <= maxCoordinate; y ++) {
			yield new RationalVector(new Rational(x), new Rational(y));
		}
	}
};

const lexicographicCompare = (v1: RationalVector, v2: RationalVector) => v1.x.isLessThan(v2.x) || (v1.x.equals(v2.x) && v1.y.isLessThan(v2.y));

const triangles = function*(maxCoordinate: number) {
	for(const vertex1 of pointsInSquare(maxCoordinate)) {
		for(const vertex2 of pointsInSquare(maxCoordinate)) {
			const triangle = new Triangle([new RationalVector(new Rational(0), new Rational(0)), vertex1, vertex2]);
			if(!triangle.isDegenerate() && lexicographicCompare(vertex1, vertex2)) {
				yield triangle;
			}
		}
	}
};

export const numRightTriangles = (maxCoordinate: number) => {
	let result = 0;
	for(const triangle of triangles(maxCoordinate)) {
		if(triangle.isRight()) {
			console.log(triangle.vertices.join(", "));
			result ++;
		}
	}
	return result;
};

// console.log(numRightTriangles(50));
// debugger;
