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
