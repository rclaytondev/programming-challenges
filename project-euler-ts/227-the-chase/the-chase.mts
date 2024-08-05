import { Field } from "../../utils-ts/modules/math/Field.mjs";
import { MathUtils } from "../../utils-ts/modules/math/MathUtils.mjs";
import { Matrix } from "../../utils-ts/modules/math/Matrix.mjs";
import { Rational } from "../../utils-ts/modules/math/Rational.mjs";

// const nextStates = (distance: number, numPlayers: number) => [
// 	{
// 		distance: distance,
// 		probability: new Rational(1, 2) // (4/6)^2 + (1/6)^2 + (1/6)^2
// 	},
// 	{
// 		distance: Math.min(distance - 1, numPlayers - (distance - 1)),
// 		probability: new Rational(2, 9) // 4/6 * 1/6 + 4/6 * 1/6
// 	},
// 	{
// 		distance: Math.min(distance + 1, numPlayers - (distance + 1)),
// 		probability: new Rational(2, 9), // 4/6 * 1/6 + 4/6 * 1/6
// 	},
// 	{
// 		distance: Math.min(distance - 2, numPlayers - (distance - 2)),
// 		probability: new Rational(1, 36)
// 	},
// 	{
// 		distance: Math.min(distance + 2, numPlayers - (distance + 2)),
// 		probability: new Rational(1, 36)
// 	},
// ];

// const cyclicDist = (a: number, b: number, numPlayers: number) => Math.min(Math.abs(a - b), Math.abs(numPlayers - a - b));

// const getMatrix = (numPlayers: number) => Matrix.fromFunction(
// 	numPlayers / 2,
// 	numPlayers / 2,
// 	(row, column) => {
// 		if(row === 0) {
// 			return (column === 0) ? new Rational(1) : new Rational(0);
// 		}
// 		const dist = cyclicDist(row, column, numPlayers);
// 		if(dist === 0) { return new Rational(1, 2); }
// 		else if(dist === 1) { return new Rational(-2, 9); }
// 		else if(dist === 2) { return new Rational(-1, 36); }
// 		else { return new Rational(0); }
// 	},
// 	Field.RATIONALS
// );

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
