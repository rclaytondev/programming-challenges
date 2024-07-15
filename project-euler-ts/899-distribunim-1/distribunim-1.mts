import { Field } from "../../utils-ts/modules/math/Field.mjs";
import { Matrix } from "../../utils-ts/modules/math/Matrix.mjs";
import { Utils } from "../../utils-ts/modules/Utils.mjs";

const getChildren = function*(pile1: number, pile2: number): Generator<[number, number]> {
	[pile1, pile2] = [Math.min(pile1, pile2), Math.max(pile1, pile2)];
	for(let numStones = (pile1 === pile2) ? 1 : 0; numStones < pile1; numStones ++) {
		yield [pile1 - numStones, pile2 - (pile1 - numStones)];
	}
};
const isLosing: (pile1: number, pile2: number) => boolean = Utils.memoize(
	(pile1: number, pile2: number): boolean => {
		if(pile1 === 1) { return (pile2 % 2 === 1); }
		return [...getChildren(pile1, pile2)].every(c => !isLosing(...c));
	},
	(pile1: number, pile2: number): [number, number] => [Math.min(pile1, pile2), Math.max(pile1, pile2)]
);
export const numLosing = (maxPileSize: number) => {
	let total = 0;
	for(let largerPile = 1; largerPile <= maxPileSize; largerPile ++) {
		for(let smallerPile = 1; smallerPile <= largerPile; smallerPile ++) {
			if(isLosing(smallerPile, largerPile)) {
				total += (smallerPile === largerPile) ? 1 : 2;
			}
			else { continue; }
		}
		console.log(`done with ${largerPile}`);
	}
	return total;
};
console.log(numLosing(7 ** 17));

const minimumExcludant = (nums: number[]) => {
	let i = 0;
	while(true) {
		if(!nums.includes(i)) { return i; }
		i ++;
	}
};
const grundyValue = Utils.memoize(
	(pile1: number, pile2: number): number => minimumExcludant([...getChildren(pile1, pile2)].map(c => grundyValue(...c))),
	(pile1: number, pile2: number): [number, number] => [Math.min(pile1, pile2), Math.max(pile1, pile2)]	
);

const logGrundyValues = (maxPileSize: number) => {
	const matrix = new Matrix(maxPileSize - 1, maxPileSize - 1, Field.REALS);
	for(let pile1 = 1; pile1 <= maxPileSize; pile1 ++) {
		for(let pile2 = 1; pile2 <= maxPileSize; pile2 ++) {
			matrix.set(pile1 - 1, pile2 - 1, grundyValue(pile1, pile2));
		}
	}
	console.log(matrix.toString());
};
