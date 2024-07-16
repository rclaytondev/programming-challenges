import { Field } from "../../utils-ts/modules/math/Field.mjs";
import { Matrix } from "../../utils-ts/modules/math/Matrix.mjs";
import { Sequence } from "../../utils-ts/modules/math/Sequence.mjs";
import { Utils } from "../../utils-ts/modules/Utils.mjs";

const getChildren = function*(piles: number[]) {
	const smallestPile = Math.min(...piles);
	for(const stonesTaken of Sequence.NONNEGATIVE_INTEGERS.tuplesWithSum(smallestPile, piles.length)) {
		const result = piles.map((stones, i) => stones - stonesTaken[i]);;
		if(!result.includes(0)) {
			yield result;
		}
	}
};
const isLosing: (piles: number[]) => boolean = Utils.memoize(
	(piles: number[]) => [...getChildren(piles)].every(c => !isLosing(c)),
	piles => [[...piles].sort((a, b) => a - b)]
);
export const smallestLosing = (num: number) => {
	for(let k = 0; k < Infinity; k ++) {
		if(isLosing([
			...new Array(num).fill(num),
			num + k
		])) { return k; }
	}
	throw new Error("Unreachable.");
};

const minimumExcludant = (nums: number[]) => {
	let i = 0;
	while(true) {
		if(!nums.includes(i)) { return i; }
		i ++;
	}
};
const grundyValue: (piles: number[]) => number = Utils.memoize(
	(piles: number[]) => minimumExcludant([...getChildren(piles)].map(c => grundyValue(c))),
	piles => [[...piles].sort((a, b) => a - b)]
);
const show2DSlice = (piles: number[], size: number) => {
	const result = new Matrix(size - 1, size - 1, Field.REALS);
	for(let pile1 = 1; pile1 <= size; pile1 ++) {
		for(let pile2 = 1; pile2 <= size; pile2 ++) {
			result.set(pile1 - 1, pile2 - 1, grundyValue([...piles, pile1, pile2]));
		}
	}
	console.log(result.toString());
	debugger;
};
// show2DSlice([10, 10], 20);

for(let n = 1; n < 20; n ++) {
	console.log(`t(${n}) = ${smallestLosing(n)}`);
}
debugger;
