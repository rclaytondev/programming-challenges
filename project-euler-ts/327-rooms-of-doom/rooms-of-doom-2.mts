import { MathUtils } from "../../utils-ts/modules/math/MathUtils.mjs";
import { Utils } from "../../utils-ts/modules/Utils.mjs";

export const cardsRequired = (rooms: number, carryableCards: number): number => {
	if(rooms + 1 <= carryableCards) {
		return rooms + 1;
	}
	const cards = cardsRequired(rooms - 1, carryableCards);
	const trips = Math.ceil((cards - (carryableCards - 1)) / (carryableCards - 2));
	return cards + 2 * trips + 1;
};

const solve = () => {
	return MathUtils.sum(Utils.range(3, 40).map(cards => cardsRequired(30, cards)));
};
