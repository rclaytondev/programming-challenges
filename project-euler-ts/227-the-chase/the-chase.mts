import { Field } from "../../utils-ts/modules/math/Field.mjs";
import { MathUtils } from "../../utils-ts/modules/math/MathUtils.mjs";
import { Matrix } from "../../utils-ts/modules/math/Matrix.mjs";
import { Rational } from "../../utils-ts/modules/math/Rational.mjs";

const distanceRepresentative = (dist: number, numPlayers: number) => {
	dist = MathUtils.generalizedModulo(dist, numPlayers);
	return Math.min(dist, Math.abs(numPlayers - dist));
};

const getMatrix = (numPlayers: number) => {
	const size = numPlayers / 2 + 1;
	const matrix = new Matrix(size, size, Field.RATIONALS);
	matrix.set(0, 0, new Rational(1));
	for(let distance = 1; distance < size; distance ++) {
		matrix.update(distance, distance, v => v.add(new Rational(1, 2)));
		matrix.update(distance, distanceRepresentative(distance + 1, numPlayers), v => v.subtract(new Rational(2, 9)));
		matrix.update(distance, distanceRepresentative(distance - 1, numPlayers), v => v.subtract(new Rational(2, 9)));
		matrix.update(distance, distanceRepresentative(distance + 2, numPlayers), v => v.subtract(new Rational(1, 36)));
		matrix.update(distance, distanceRepresentative(distance - 2, numPlayers), v => v.subtract(new Rational(1, 36)));
	}
	return matrix;
};
const n = 10;
console.log(getMatrix(n).toString());
console.log(getMatrix(n).inverse()!.toString());
debugger;
