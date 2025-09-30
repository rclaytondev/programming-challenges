import { describe, it } from "mocha";
import { HashSet } from "../../utils-ts/modules/HashSet.mjs";
import { Table } from "../../utils-ts/modules/Table.mjs";
import { Utils } from "../../utils-ts/modules/Utils.mjs";
import { assert } from "chai";
import { CountLogger } from "../project-specific-utilities/CountLogger.mjs";

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

const idempotents = (maxEntry: number) => {
	const logger = new CountLogger(n => 10000 * n, (2 * maxEntry + 1) ** 3);
	const matrices = new HashSet<Table<number>>([], tableToString);

	for(const [b0, b1, b2] of Utils.cartesianPower(Utils.range(-maxEntry, maxEntry + 1), 3)) {
		logger.count();
		const rowMax = Math.max(Math.abs(b0), Math.abs(b1), Math.abs(b2));
		if(rowMax === 0) { continue; }
		const maximum = Math.floor((maxEntry + 1) / rowMax);
		for(const [a0, a1, a2] of Utils.cartesianPower(Utils.range(-maximum, maximum), 3)) {
			if(b0 * a0 + b1 * a1 + b2 * a2 !== 1) { continue; }
			const rank1Matrix = new Table([
				[b0 * a0, b1 * a0, b2 * a0],
				[b0 * a1, b1 * a1, b2 * a1],
				[b0 * a2, b1 * a2, b2 * a2],
			]);
			const rank2Matrix = rank1Matrix.map((v, i, j) => (i === j ? 1 : 0) - v);
			for(const matrix of [rank1Matrix, rank2Matrix]) {
				if(matrix.every(v => Math.abs(v) <= maxEntry)) {
					matrices.add(matrix);
				}
			}
		}
	}
	matrices.add(IDENTITY);
	matrices.add(ZERO);
	return matrices.size;
};

describe("idempotents", () => {
	it("returns the correct answer for -1 <= (entries) <= 1", () => {
		const result = idempotents(1);
		assert.equal(result, 164);
	});
	it("returns the correct answer for -2 <= (entries) <= 2", () => {
		const result = idempotents(2);
		assert.equal(result, 848);
	});
});

console.time();
console.log(idempotents(50));
console.timeEnd();
debugger;
