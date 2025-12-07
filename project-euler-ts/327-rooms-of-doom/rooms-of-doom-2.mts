import { ArrayUtils } from "../../utils-ts/modules/core-extensions/ArrayUtils.mjs";
import { MathUtils } from "../../utils-ts/modules/math/MathUtils.mjs";

export const cardsRequired = (rooms: number, carryableCards: number): number => {
	if(rooms + 1 <= carryableCards) {
		return rooms + 1;
	}
	const cards = cardsRequired(rooms - 1, carryableCards);
	const trips = Math.ceil((cards - (carryableCards - 1)) / (carryableCards - 2));
	return cards + 2 * trips + 1;
};

const solve = () => {
	return MathUtils.sum(ArrayUtils.range(3, 40).map(cards => cardsRequired(30, cards)));
};
