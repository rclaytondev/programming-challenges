import { MathUtils } from "../../utils-ts/modules/math/MathUtils.mjs";
import { Utils } from "../../utils-ts/modules/Utils.mjs";

const MAX_MODULO = 2 * 3 * 5 * 7;

const isModularSquare = (num: number, modulo: number) => {
	num %= modulo;
	for(let k = 0; k < modulo; k ++) {
		if(k ** 2 % modulo === num) {
			return true;
		}
	}
	return false;
};

const getModularTriples = (modulo: number) => {
	const results: number[][] = [];
	for(let a = 0; a < modulo; a ++) {
		results[a] = [];
		for(let b = 0; b < modulo; b ++) {
			if(isModularSquare(a ** 2 + b ** 2, modulo)) {
				results[a].push(b);
			}
		}
	}
	return results;
};

const getProportionChecked = (modularTriples: number[][]) => {
	return MathUtils.sum(modularTriples.map(offsets => offsets.length + 1)) / (modularTriples.length ** 2);
};
const getBestModularTriples = (maxModulo: number) => {
	return Utils.minValue(Utils.range(1, maxModulo).map(getModularTriples), getProportionChecked);
};

const solve = (upperBound: number) => {
	console.time(`modular precomputation`);
	const modularTriples = getBestModularTriples(MAX_MODULO);
	console.timeEnd(`modular precomputation`);
	console.time(`solving the problem`);
	const numTriangles = new Map<number, number>();
	for(let leg1 = 1; leg1 * 2 < upperBound; leg1 ++) {
		multiplierLoop: for(let multiplier = 0; true; multiplier ++) {
			for(const offset of modularTriples[leg1 % modularTriples.length]) {
				const leg2 = multiplier * modularTriples.length + offset;
				const hypotenuse = Math.sqrt(leg1 ** 2 + leg2 ** 2);
				const perimeter = leg1 + leg2 + hypotenuse;
				if(perimeter > upperBound) {
					break multiplierLoop;
				}
				if(hypotenuse % 1 === 0) {
					numTriangles.set(perimeter, (numTriangles.get(perimeter) ?? 0) + 1);
				}
			}
		}
	}
	console.timeEnd(`solving the problem`);
	return [...numTriangles].filter(([k, v]) => v === 1).length;
};
console.log(solve(100000));
debugger;


// console.log(getModularTriples(8));
// debugger;
