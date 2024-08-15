import { MathUtils } from "../../utils-ts/modules/math/MathUtils.mjs";
import { Utils } from "../../utils-ts/modules/Utils.mjs";

// const MAX_MODULO = 1000;
const MAX_MODULO = 10;

const getModularSquares = (modulo: number) => {
	let squares = new Set<number>();
	for(let i = 0; i < modulo; i ++) {
		squares.add((i ** 2) % modulo);
	}
	return squares;
};

const getModularTriples = (modulo: number) => {
	const squares = getModularSquares(modulo);
	const results: number[][] = [];
	for(let a = 0; a < modulo; a ++) {
		results[a] = [];
		for(let b = 0; b < modulo; b ++) {
			if(squares.has((a ** 2 + b ** 2) % modulo)) {
				results[a].push(b);
			}
		}
	}
	return results;
};

const getProportionChecked = (modularTriples: number[][]) => {
	return MathUtils.sum(modularTriples.map(offsets => offsets.length)) / (modularTriples.length ** 2);
};
const getBestModularTriples = (maxModulo: number) => {
	return Utils.minValue(Utils.range(1, maxModulo).map(getModularTriples), getProportionChecked);
};

export const trianglesWithPerimeter = (upperBound: number) => {
	// console.time(`modular precomputation`);
	const modularTriples = getBestModularTriples(MAX_MODULO);
	// console.timeEnd(`modular precomputation`);
	// console.log(`best modulo: ${modularTriples.length}, which requires checking ${(getProportionChecked(modularTriples) * 100).toFixed(2)}% of all numbers.`);
	// console.time(`solving the problem`);
	const numTriangles = new Map<number, number>();
	for(let leg1 = 1; leg1 * 2 < upperBound; leg1 ++) {
		multiplierLoop: for(let multiplier = 0; true; multiplier ++) {
			for(const offset of modularTriples[leg1 % modularTriples.length]) {
				const leg2 = multiplier * modularTriples.length + offset;
				if(leg2 === 0) { continue; }
				const hypotenuse = Math.sqrt(leg1 ** 2 + leg2 ** 2);
				const perimeter = leg1 + leg2 + hypotenuse;
				if(perimeter > upperBound || leg2 > leg1) {
					break multiplierLoop;
				}
				else if(hypotenuse % 1 === 0) {
					numTriangles.set(perimeter, (numTriangles.get(perimeter) ?? 0) + 1);
				}
			}
		}
	}
	// console.timeEnd(`solving the problem`);
	return numTriangles;
};

export const solve = (upperBound: number) => {
	return [...trianglesWithPerimeter(upperBound)].filter(([k, v]) => v === 1).length;
};
// console.log(solve(1500000));
// debugger;
