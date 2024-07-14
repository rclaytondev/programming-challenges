import { Field } from "../../utils-ts/modules/math/Field.mjs";
import { Matrix } from "../../utils-ts/modules/math/Matrix.mjs";
import { Utils } from "../../utils-ts/modules/Utils.mjs";

const getChildren = function*(pile1: number, pile2: number): Generator<[number, number]> {
	[pile1, pile2] = [Math.min(pile1, pile2), Math.max(pile1, pile2)];
	for(let numStones = (pile1 === pile2) ? 1 : 0; numStones < pile1; numStones ++) {
		yield [pile1 - numStones, pile2 - (pile1 - numStones)];
	}
};
const isLosing = Utils.memoize(
	(pile1: number, pile2: number): boolean => [...getChildren(pile1, pile2)].every(c => !isLosing(...c)),
	(pile1: number, pile2: number): [number, number] => [Math.min(pile1, pile2), Math.max(pile1, pile2)]
);
export const numLosing = (maxPileSize: number) => {
	let total = 0;
	for(let pile1 = 1; pile1 <= maxPileSize; pile1 ++) {
		for(let pile2 = 1; pile2 <= maxPileSize; pile2 ++) {
			if(isLosing(pile1, pile2)) {
				total ++;
			}
		}
	}
	return total;
};

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
