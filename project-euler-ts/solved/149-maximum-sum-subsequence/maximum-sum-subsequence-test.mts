import { describe } from "mocha";
import { Problem149 } from "./maximum-sum-subsequence.mjs";
import { assert } from "chai";
import { Table } from "../../../utils-ts/modules/Table.mjs";

describe("Problem149.maxSubsequence", () => {
	it("returns the sum of the contiguous subsequence with the largest sum", () => {
		const numbers = [
			1, 2, -5, 4, 1, 10, -3, 3, 2, -5, 2,
		];
		const largestSum = Problem149.maxSubsequence(numbers);
		assert.equal(largestSum, 4 + 1 + 10 - 3 + 3 + 2);
	});
});
describe("Problem149.mainDiagonals", () => {
	it("returns the main diagonals (top-left to bottom-right) of the given table, in no particular order", () => {
		const table = new Table([
			[1, 2, 3],
			[4, 5, 6],
			[7, 8, 9],
		]);
		const diagonals = Problem149.mainDiagonals(table);
		assert.sameDeepMembers(diagonals, [
			[7],
			[4, 8],
			[1, 5, 9],
			[2, 6],
			[3],
		]);
	});
	it("works for a table that is wider than it is tall", () => {
		const table = new Table([
			[1, 2, 3],
			[4, 5, 6],
		]);
		const diagonals = Problem149.mainDiagonals(table);
		assert.sameDeepMembers(diagonals, [
			[4],
			[1, 5],
			[2, 6],
			[3],
		]);
	});
	it("works for a table that is taller than it is wide", () => {
		const table = new Table([
			[1, 2],
			[3, 4],
			[5, 6],
		]);
		const diagonals = Problem149.mainDiagonals(table);
		assert.sameDeepMembers(diagonals, [
			[5],
			[3, 6],
			[1, 4],
			[2],
		]);
	});
});
describe("Problem149.antidiagonals", () => {
	it("returns the antidiagonals of the given table (top-right to bottom-left)", () => {
		const table = new Table([
			[1, 2, 3],
			[4, 5, 6],
			[7, 8, 9],
		]);
		const antidiagonals = Problem149.antidiagonals(table);
		assert.sameDeepMembers(antidiagonals, [
			[1],
			[2, 4],
			[3, 5, 7],
			[6, 8],
			[9],
		]);
	});
});
describe("Problem149.maxSubsequenceInTable", () => {
	it("works for the example from Project Euler", () => {
		const maxSubsequence = Problem149.maxSubsequenceInTable(new Table([
			[-2, 5, 3, 1],
			[9, -6, 5, 1],
			[3, 2, 7, 3],
			[-1, 8, -4, 8],
		]));
		assert.equal(maxSubsequence, 8 + 7 + 1);
	});
});
describe("Problem149.prng", () => {
	it("works for the examples from Project Euler", () => {
		const terms = Problem149.prng(100);
		assert.equal(terms[10 - 1], -393027);
		assert.equal(terms[100 - 1], 86613);
	});
});
describe("Problem149.wrapByRows", () => {
	it("can place the values in a table left to right, wrapping onto the next row", () => {
		const result = Problem149.wrapByRows([1, 2, 3, 4, 5, 6], 3);
		assert.deepEqual(result.rows, [
			[1, 2, 3],
			[4, 5, 6],
		]);
	});
});
