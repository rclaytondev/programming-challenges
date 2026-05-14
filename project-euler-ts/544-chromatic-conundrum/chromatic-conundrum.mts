import { Vector } from "../../utils-ts/modules/geometry/Vector.mjs";
import { MathUtils } from "../../utils-ts/modules/math/MathUtils.mjs";
import { HashGraph } from "./HashGraph.mjs";
import { Polynomial } from "./Polynomial.mjs";

const rectangleGraph = (width: number, height: number) => {
	const vertices = [];
	for(let x = 0; x <= width; x ++) {
		for(let y = 0; y <= height; y ++) {
			vertices.push(new Vector(x, y));
		}
	}
	return HashGraph.fromFunction(vertices, (a, b) => a.isOrthogonallyAdjacentTo(b));
};

export const chromaticPolynomial = <T, >(graph: HashGraph<T>): Polynomial => {
	for(const vertex1 of graph.vertices()) {
		const neighbors = graph.neighbors(vertex1);
		if(neighbors.size !== 0) {
			const vertex2 = [...neighbors][0];
			const deleted = graph.copy().disconnect(vertex1, vertex2);
			const contracted = graph.copy().identify([vertex1, vertex2], vertex1);
			return chromaticPolynomial(deleted).subtract(chromaticPolynomial(contracted));
		}
	}
	return Polynomial.monomial(graph.numVertices());
};

export const naiveMonomialSum = (power: number, upperBound: number) => {
	let sum = 0;
	for(let x = 1; x <= upperBound; x ++) {
		sum += x ** power;
	}
	return sum;
};

export const monomialSum = (power: number, upperBound: number) => {
	if(upperBound <= 0) {
		return 0;
	}
	if(power === 0) {
		return upperBound;
	}
	let result = upperBound ** (power + 1);
	for(let k = 0; k <= power - 1; k ++) {
		result -= MathUtils.binomial(power + 1, k) * monomialSum(k, upperBound);
	}
	return result / (power + 1) + upperBound ** power;
};

export const polynomialSum = (polynomial: Polynomial, upperBound: number) => {
	
};
