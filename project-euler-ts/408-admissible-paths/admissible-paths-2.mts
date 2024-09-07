import { Vector } from "../../utils-ts/modules/geometry/Vector.mjs";
import { HashSet } from "../../utils-ts/modules/HashSet.mjs";
import { BigintMath } from "../../utils-ts/modules/math/BigintMath.mjs";
import { Field } from "../../utils-ts/modules/math/Field.mjs";

const getInadmissiblePoints = (gridSize: number) => {
	const points = new HashSet<Vector>();
	for(let x = 1; x ** 2 <= gridSize; x ++) {
		for(let y = 1; y ** 2 <= gridSize; y ++) {
			const sum = x ** 2 + y ** 2;
			if(Math.floor(Math.sqrt(sum)) ** 2 === sum) {
				points.add(new Vector(x ** 2, y ** 2));
			}
		}
	}
	return points;
};

const inadmissiblePathsTo = (point: Vector, inadmissiblePoints: HashSet<Vector>, modulo: number) => {
	let result = 0n;
	for(const inadmissible of inadmissiblePoints) {
		const newInadmissibles = inadmissiblePoints.filter(p => p.x <= inadmissible.x && p.y <= inadmissible.y && !p.equals(inadmissible));
		newInadmissibles.delete(point);
		const paths1 = admissiblePathsTo(inadmissible, newInadmissibles, modulo);
		const paths2 = modularCombination(point.x - inadmissible.x + point.y - inadmissible.y, point.y - inadmissible.y, modulo);
		result += (paths1 * BigInt(paths2));
		result %= BigInt(modulo);
	}
	return result;
};

const admissiblePathsTo = (point: Vector, inadmissiblePoints: HashSet<Vector>, modulo: number) => {
	const totalPaths = modularCombination(point.x + point.y, point.x, modulo);
	return BigintMath.generalizedModulo(
		BigInt(totalPaths) - inadmissiblePathsTo(point, inadmissiblePoints, modulo),
		BigInt(modulo)
	);
};

export const admissiblePaths = (gridSize: number, modulo: number) => {
	return admissiblePathsTo(
		new Vector(gridSize, gridSize),
		getInadmissiblePoints(gridSize),
		modulo
	);
};

export const modularCombination = (n: number, k: number, modulo: number | bigint) => {
	/* 
	Computes (`n` choose `k`) mod `modulo`, assuming that:
	- modulo is prime
	-k <= modulo.
	- n, k <= Number.MAX_SAFE_INTEGER
	*/
	modulo = BigInt(modulo);
	let product = 1n;
	for(let i = n - k + 1; i <= n; i ++) {
		product *= BigInt(i);
		product %= modulo;
	}
	const field = Field.integersModulo(Number(modulo));
	let denominator = 1n;
	for(let i = 1n; i <= k; i ++) {
		denominator *= i;
		denominator %= modulo;
	}
	// console.log(`${n} choose ${k} mod ${modulo} = ${product}`);
	return Number(product * BigInt(field.inverse(Number(denominator))) % modulo);
};

// console.time();
// console.log(admissiblePaths(10_000_000, 1_000_000_007));
// console.timeEnd();
// debugger;
