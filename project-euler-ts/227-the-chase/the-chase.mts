import { BigRational } from "../../utils-ts/modules/math/BigRational.mjs";
import { Field } from "../../utils-ts/modules/math/Field.mjs";
import { MathUtils } from "../../utils-ts/modules/math/MathUtils.mjs";
import { Matrix } from "../../utils-ts/modules/math/Matrix.mjs";

const distanceRepresentative = (dist: number, numPlayers: number) => {
	dist = MathUtils.generalizedModulo(dist, numPlayers);
	return Math.min(dist, Math.abs(numPlayers - dist));
};

const getMatrix = (numPlayers: number) => {
	const size = numPlayers / 2 + 1;
	const matrix = new Matrix(size, size, Field.BIG_RATIONALS);
	matrix.set(0, 0, new BigRational(1));
	for(let distance = 1; distance < size; distance ++) {
		matrix.update(distance, distance, v => v.add(new BigRational(1, 2)));
		matrix.update(distance, distanceRepresentative(distance + 1, numPlayers), v => v.subtract(new BigRational(2, 9)));
		matrix.update(distance, distanceRepresentative(distance - 1, numPlayers), v => v.subtract(new BigRational(2, 9)));
		matrix.update(distance, distanceRepresentative(distance + 2, numPlayers), v => v.subtract(new BigRational(1, 36)));
		matrix.update(distance, distanceRepresentative(distance - 2, numPlayers), v => v.subtract(new BigRational(1, 36)));
	}
	return matrix;
};
const solve = (numPlayers: number) => {
	const values = getMatrix(numPlayers).inverse()!.values();
	const lastRow = values[values.length - 1];
	return Field.BIG_RATIONALS.sum(...lastRow.slice(1));
};
console.log(solve(100).toNumber(11));
debugger;
