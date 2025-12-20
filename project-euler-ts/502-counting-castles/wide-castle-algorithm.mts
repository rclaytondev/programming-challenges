/* 
This algorithm counts castles by repeatedly cutting it in half horizontally.
(This means it is supposed to be fast for wide, short rectangles).
*/

import { MathUtils } from "../../utils-ts/modules/math/MathUtils.mjs";
import { Utils } from "../../utils-ts/modules/Utils.mjs";

export type Parity = (typeof Parities.PARITIES)[number];

export class Parities {
	static PARITIES = ["even", "odd"] as const;
	static opposite = {
		"even": "odd",
		"odd": "even"
	} as const;

	static parity(num: number) {
		return (num % 2 === 0) ? "even" : "odd";
	}
}

const paths = Utils.memoize((width: number, height: number, startY: number, endY: number, parity: Parity, modulo: number) => {
	if(width === 1) {
		if(startY <= endY) {
			return Parities.parity(endY - startY) === parity ? 1 : 0;
		}
		else {
			return (parity === "even") ? 1 : 0;
		}
	}

	const pivotX = (width % 2 === 1) ? width - 1 : width / 2;
	let result = 0;
	for(let midY = 0; midY <= height; midY ++) {
		const left1 = paths(pivotX, height, startY, midY, "even", modulo);
		const right1 = paths(width - pivotX, height, midY, endY, parity, modulo);
		result = (result + (left1 * right1)) % modulo;

		const left2 = paths(pivotX, height, startY, midY, "odd", modulo);
		const right2 = paths(width - pivotX, height, midY, endY, Parities.opposite[parity], modulo);
		result = (result + (left2 * right2)) % modulo;
	}
	return result;
});

const allCastles = (width: number, height: number, modulo: number) => {
	let result = 0;
	for(let endY = 0; endY <= height; endY ++) {
		result += paths(width, height, 0, endY, "odd", modulo);
	}
	return result;
};

export const fullHeightCastles = (width: number, height: number, modulo: number) => {
	return MathUtils.generalizedModulo(
		allCastles(width, height - 1, modulo) - allCastles(width, height - 2, modulo),
		modulo
	);
};

// console.time();
// console.log(fullHeightCastles(10 ** 12, 20, 1_000_000_007));
// console.timeEnd();
// debugger;
