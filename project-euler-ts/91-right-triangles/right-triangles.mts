import { Line } from "../../utils-ts/modules/geometry/Line.mjs";
import { Vector } from "../../utils-ts/modules/geometry/Vector.mjs";

class Triangle {
	vertices: [Vector, Vector, Vector];

	constructor(vertices: [Vector, Vector, Vector]) {
		this.vertices = vertices;
	}

	edges() {
		return [
			new Line(this.vertices[0], this.vertices[1]),
			new Line(this.vertices[1], this.vertices[2]),
			new Line(this.vertices[2], this.vertices[0]),
		];
	}

	isDegenerate() {
		const [v1, v2, v3] = this.vertices;
		if(v1.equals(v2) || v1.equals(v3) || v2.equals(v3)) {
			return true;
		}
		return Line.areCollinear(this.vertices);
	}
	isRight() {
		const [e1, e2, e3] = this.edges();
		return e1.isPerpendicularTo(e2) || e2.isPerpendicularTo(e3) || e3.isPerpendicularTo(e1);
	}
}

const pointsInSquare = function*(maxCoordinate: number) {
	for(let x = 0; x <= maxCoordinate; x ++) {
		for(let y = 0; y <= maxCoordinate; y ++) {
			yield new Vector(x, y);
		}
	}
};

const lexicographicCompare = (v1: Vector, v2: Vector) => v1.x < v2.x || (v1.x === v2.x && v1.y < v2.y);

const triangles = function*(maxCoordinate: number) {
	for(const vertex1 of pointsInSquare(maxCoordinate)) {
		for(const vertex2 of pointsInSquare(maxCoordinate)) {
			const triangle = new Triangle([new Vector(0, 0), vertex1, vertex2]);
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
