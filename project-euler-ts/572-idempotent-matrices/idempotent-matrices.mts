import { HashSet } from "../../utils-ts/modules/HashSet.mjs";
import { Table } from "../../utils-ts/modules/Table.mjs";
import { Utils } from "../../utils-ts/modules/Utils.mjs";

const tableToString = (table: Table<number>) => `[${table.rows.map(r => `[${r.join(", ")}]`).join(", ")}]`;

const IDENTITY = new Table([
	[1, 0, 0],
	[0, 1, 0],
	[0, 0, 1]
]);
const ZERO = new Table([
	[0, 0, 0],
	[0, 0, 0],
	[0, 0, 0]
]);

export const idempotents = (maxEntry: number, mode: "rank-1" | "rank-2" | "all" = "all") => {
	const matrices = new HashSet<Table<number>>([], tableToString);

	for(const [b0, b1, b2] of Utils.cartesianPower(Utils.range(-maxEntry, maxEntry + 1), 3)) {
		const rowMax = Math.max(Math.abs(b0), Math.abs(b1), Math.abs(b2));
		if(rowMax === 0) { continue; }
		const maximum = Math.floor((maxEntry + 1) / rowMax);
		for(const [a0, a1] of Utils.cartesianPower(Utils.range(-maximum, maximum), 2)) {
			if(b2 === 0 && b0 * a0 + b1 * a1 !== 1) { continue; }
			for(const a2 of (b2 === 0) ? Utils.range(-maximum, maximum) : [(1 - a0 * b0 - a1 * b1) / b2]) {
				if(Math.floor(a2) !== a2) { continue; }
				const rank1Matrix = new Table([
					[b0 * a0, b1 * a0, b2 * a0],
					[b0 * a1, b1 * a1, b2 * a1],
					[b0 * a2, b1 * a2, b2 * a2],
				]);
				const rank2Matrix = rank1Matrix.map((v, i, j) => (i === j ? 1 : 0) - v);
				if((mode === "rank-1" || mode === "all") && rank1Matrix.every(v => Math.abs(v) <= maxEntry)) {
					matrices.add(rank1Matrix);
				}
				if((mode === "rank-2" || mode === "all") && rank2Matrix.every(v => Math.abs(v) <= maxEntry)) {
					matrices.add(rank2Matrix);
				}
			}
		}
	}
	if(mode === "all") {
		matrices.add(IDENTITY);
		matrices.add(ZERO);
	}
	return matrices.size;
};

export const rank1Idempotents = (maxEntry: number) => idempotents(maxEntry, "rank-1");
export const rank2Idempotents = (maxEntry: number) => idempotents(maxEntry, "rank-2");

// console.time();
// console.log(idempotents(50));
// console.timeEnd();
// debugger;
