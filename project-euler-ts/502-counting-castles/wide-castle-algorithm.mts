/* 
This algorithm counts castles by repeatedly cutting it in half horizontally.
(This means it is supposed to be fast for wide, short rectangles).
*/

import { BigintMath } from "../../utils-ts/modules/math/BigintMath.mjs";
import { MathUtils } from "../../utils-ts/modules/math/MathUtils.mjs";
import { Utils } from "../../utils-ts/modules/Utils.mjs";

export type Parity = (typeof Parities.PARITIES)[number];

export class Parities {
	static PARITIES = ["even", "odd"] as const;
	static opposite = {
		"even": "odd",
		"odd": "even"
	} as const;

	static parity(num: number | bigint) {
		return (BigInt(num) % 2n === 0n) ? "even" : "odd";
	}
}

const paths = Utils.memoize((width: bigint, height: bigint, startY: bigint, endY: bigint, parity: Parity, modulo: bigint) => {
	if(width === 1n) {
		if(startY <= endY) {
			return Parities.parity(endY - startY) === parity ? 1n : 0n;
		}
		else {
			return (parity === "even") ? 1n : 0n;
		}
	}

	const pivotX = (width % 2n === 1n) ? width - 1n : width / 2n;
	let result = 0n;
	for(let midY = 0n; midY <= height; midY ++) {
		const left1 = paths(pivotX, height, startY, midY, "even", modulo);
		const right1 = paths(width - pivotX, height, midY, endY, parity, modulo);
		result = (result + (left1 * right1)) % modulo;

		const left2 = paths(pivotX, height, startY, midY, "odd", modulo);
		const right2 = paths(width - pivotX, height, midY, endY, Parities.opposite[parity], modulo);
		result = (result + (left2 * right2)) % modulo;
	}
	return result;
});

const allCastles = (width: bigint, height: bigint, modulo: bigint) => {
	let result = 0n;
	for(let endY = 0n; endY <= height; endY ++) {
		result += paths(width, height, 0n, endY, "odd", modulo);
	}
	return result;
};

export const fullHeightCastles = (width: bigint, height: bigint, modulo: bigint) => {
	return BigintMath.generalizedModulo(
		allCastles(width, height - 1n, modulo) - allCastles(width, height - 2n, modulo),
		modulo
	);
};

// console.time();
// console.log(fullHeightCastles(10 ** 12, 20, 1_000_000_007));
// console.timeEnd();
// debugger;
