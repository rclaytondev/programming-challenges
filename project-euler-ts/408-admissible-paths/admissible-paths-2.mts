import { Vector } from "../../utils-ts/modules/geometry/Vector.mjs";
import { HashSet } from "../../utils-ts/modules/HashSet.mjs";
import { BigintMath } from "../../utils-ts/modules/math/BigintMath.mjs";
import { Field } from "../../utils-ts/modules/math/Field.mjs";
import { Utils } from "../../utils-ts/modules/Utils.mjs";
import { VectorSet } from "./VectorSet.mjs";

const getInadmissiblePoints = (width: number, height: number) => {
	const points = [];
	for(let x = 1; x ** 2 <= width; x ++) {
		for(let y = 1; y ** 2 <= height; y ++) {
			const sum = x ** 2 + y ** 2;
			if(Math.floor(Math.sqrt(sum)) ** 2 === sum) {
				points.push(new Vector(x ** 2, y ** 2));
			}
		}
	}
	return points;
};

let inadmissiblePathsCache = new Map<string, bigint>();
export const inadmissiblePathsTo = (point: Vector, modulo: number) => {
	const argsString = `${point},${modulo}`;
	const reversedArgsString = `${new Vector(point.y, point.x)},${modulo}`;
	if(inadmissiblePathsCache.has(argsString)) {
		return inadmissiblePathsCache.get(argsString)!;
	}
	if(inadmissiblePathsCache.has(reversedArgsString)) {
		return inadmissiblePathsCache.get(reversedArgsString)!;
	}
	let result = 0n;
	for(const inadmissible of getInadmissiblePoints(point.x, point.y)) {
		if(inadmissible.x === point.x && inadmissible.y === point.y) { continue; }
		const paths1 = admissiblePathsTo(inadmissible, modulo);
		const paths2 = modularCombination(point.x - inadmissible.x + point.y - inadmissible.y, point.y - inadmissible.y, modulo);
		result += (paths1 * BigInt(paths2));
		result %= BigInt(modulo);
	}
	inadmissiblePathsCache.set(argsString, result);
	return result;
};

const admissiblePathsTo = (point: Vector, modulo: number) => {
	const totalPaths = modularCombination(point.x + point.y, point.x, modulo);
	return BigintMath.generalizedModulo(
		BigInt(totalPaths) - inadmissiblePathsTo(point, modulo),
		BigInt(modulo)
	);
};

export const admissiblePaths = (gridSize: number, modulo: number) => {
	return admissiblePathsTo(
		new Vector(gridSize, gridSize),
		modulo
	);
};

const modularFactorials: number[][] = [];
const modularFactorial = (num: number, modulo: number) => {
	modularFactorials[modulo] ??= [];
	if(modularFactorials[modulo][num]) {
		return modularFactorials[modulo][num];
	}
	modularFactorials[modulo][0] ??= 1;
	const row = modularFactorials[modulo];
	let value = row[row.length - 1];
	for(let i = row.length; i <= num; i ++) {
		value = Number(BigInt(value) * BigInt(i) % BigInt(modulo));
		row[i] = value;
	}
	return value;
};

const modularFields: Field<number>[] = [];

export const modularCombination = Utils.memoize(
	(n: number, k: number, modulo: number) => {
		/* 
		Computes (`n` choose `k`) mod `modulo`, assuming that:
		- modulo is prime
		-k <= modulo.
		- n, k <= Number.MAX_SAFE_INTEGER
		*/
		const field = modularFields[modulo] ?? (modularFields[modulo] = Field.integersModulo(modulo));
		return Number((
			BigInt(modularFactorial(n, modulo))
			* BigInt(field.inverse(modularFactorial(k, modulo)))
			* BigInt(field.inverse(modularFactorial(n - k, modulo)))
		) % BigInt(modulo));
	},
	(n: number, k: number, modulo: number): [number, number, number] => [n, Math.min(k, n-k), modulo]
);

// console.time();
// console.log(admissiblePaths(10_000_000, 1_000_000_007));
// console.timeEnd();
// debugger;
