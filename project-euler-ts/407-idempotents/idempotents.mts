import { MathUtils } from "../../utils-ts/modules/math/MathUtils.mjs";
import { modularRoots } from "../451-modular-inverses/modular-inverses.mjs";

export const idempotentSum = (upperBound: number) => {
	const idempotents = modularRoots(upperBound, n => n ** 2 - n, p => [0, 1]);
	return MathUtils.sum(
		idempotents.slice(2).map(ids => Math.max(...ids.offsets.slice(0, ids.offsets.length - 1)))
	);
};

// console.time();
// console.log(idempotentSum(10 ** 7));
// console.timeEnd();
// debugger;
