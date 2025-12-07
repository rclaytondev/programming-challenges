import { ArrayUtils } from "../../utils-ts/modules/core-extensions/ArrayUtils.mjs";
import { Table } from "../../utils-ts/modules/Table.mjs";
import { GenUtils } from "../../utils-ts/modules/core-extensions/GenUtils.mjs";
import { Utils } from "../../utils-ts/modules/Utils.mjs";

export const idempotents = (maxEntry: number) => {
	let result = 0;
	for(const [b0, b1, b2] of GenUtils.cartesianPower(ArrayUtils.range(-maxEntry, maxEntry + 1), 3)) {
		const firstNonzero = [b0, b1, b2].find(k => k !== 0);
		if(firstNonzero === undefined || firstNonzero < 0) { continue; }
		result += idempotentsWithImage(maxEntry, b0, b1, b2);
	}
	return result + 2;
};

const standardize = (maxEntry: number, b0: number, b1: number, b2: number) => [
	maxEntry,
	...[b0, b1, b2].sort((x, y) => x - y)
] as [number, number, number, number];

const idempotentsWithImage = Utils.memoize((maxEntry: number, b0: number, b1: number, b2: number) => {
	let result = 0;
	const rowMax = Math.max(Math.abs(b0), Math.abs(b1), Math.abs(b2));
	const maximum = Math.floor((maxEntry + 1) / rowMax);
	for(const [a0, a1] of GenUtils.cartesianPower(ArrayUtils.range(-maximum, maximum), 2)) {
		if(b2 === 0 && b0 * a0 + b1 * a1 !== 1) { continue; }
		for(const a2 of (b2 === 0) ? ArrayUtils.range(-maximum, maximum) : [(1 - a0 * b0 - a1 * b1) / b2]) {
			if(Math.floor(a2) !== a2) { continue; }
			const rank1Matrix = new Table([
				[b0 * a0, b1 * a0, b2 * a0],
				[b0 * a1, b1 * a1, b2 * a1],
				[b0 * a2, b1 * a2, b2 * a2],
			]);
			const rank2Matrix = rank1Matrix.map((v, i, j) => (i === j ? 1 : 0) - v);
			if(rank1Matrix.every(v => Math.abs(v) <= maxEntry)) {
				result ++;
			}
			if(rank2Matrix.every(v => Math.abs(v) <= maxEntry)) {
				result ++;
			}
		}
	}
	return result;
}, standardize);

// console.time();
// console.log(idempotents(200));
// console.timeEnd();
// debugger;
