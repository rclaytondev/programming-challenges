import { MathUtils } from "../../../utils-ts/modules/math/MathUtils.mjs";
import { Table } from "../../../utils-ts/modules/Table.mjs";

export class Problem149 {
	static partialSums(values: number[]) {
		const partialSums = [];
		let sum = 0;
		for(const value of values) {
			sum += value;
			partialSums.push(sum);
		}
		return partialSums;
	}
	static initialMaxSubsequence(values: number[]) {
		return Math.max(0, ...Problem149.partialSums(values));
	}
	static maxSubsequence(values: number[]): number {
		if(values.length === 0) {
			return -Infinity;
		}
		if(values.length === 1) {
			return values[0];
		}
		if(values.length === 2) {
			const [a, b] = values;
			return Math.max(a, b, a + b);
		}

		const mid = Math.floor(values.length / 2);
		const firstHalf = values.slice(0, mid);
		const secondHalf = values.slice(mid, values.length);
		const firstHalfMax = Problem149.maxSubsequence(firstHalf);
		const secondHalfMax = Problem149.maxSubsequence(secondHalf);
		const firstHalfEndMax = Problem149.initialMaxSubsequence(firstHalf.toReversed());
		const secondHalfStartMax = Problem149.initialMaxSubsequence(secondHalf);
		return Math.max(firstHalfMax, secondHalfMax, firstHalfEndMax + secondHalfStartMax);
	}

	static mainDiagonals<T>(table: Table<T>) {
		const diagonals = [];
		for(let startY = 0; startY < table.height; startY ++) {
			const diagonal = [];
			for(let x = 0; x < table.width && startY + x < table.height; x ++) {
				diagonal.push(table.rows[startY + x][x]);
			}
			diagonals.push(diagonal);
		}
		for(let startX = 1; startX < table.width; startX ++) {
			const diagonal = [];
			for(let y = 0; y < table.height && startX + y < table.width; y ++) {
				diagonal.push(table.rows[y][startX + y]);
			}
			diagonals.push(diagonal);
		}
		return diagonals;
	}
	static antidiagonals<T>(table: Table<T>) {
		return Problem149.mainDiagonals(table.reflectX());
	}
	static maxSubsequenceInTable(table: Table<number>) {
		const allLines = [
			...table.rows,
			...table.columns(),
			...Problem149.mainDiagonals(table),
			...Problem149.antidiagonals(table),
		];
		return Math.max(...allLines.map(Problem149.maxSubsequence));
	}

	static prng(length: number) {
		const MODULO = 1_000_000;
		const result: number[] = [];
		for(let i = 1; i <= length; i ++) {
			if(i <= 55) {
				result.push(MathUtils.generalizedModulo(100_003 - 200003 * i + 300007 * i ** 3, MODULO) - (MODULO / 2));
			}
			else {
				result.push(MathUtils.generalizedModulo(result[i-1 - 24] + result[i-1 - 55] + 1_000_000, MODULO) - (MODULO / 2));
			}
		}
		return result;
	}
	static wrapByRows<T>(values: T[], width: number) {
		if(values.length === 0) {
			return new Table<T>([]);
		}
		if(values.length % width !== 0) {
			throw new Error("Cannot wrap elements into table; the number of elements was not a multiple of the desired width.");
		}
		const rows: T[][] = [[]];
		for(const value of values) {
			if(rows[rows.length - 1].length >= width) {
				rows.push([]);
			}
			rows[rows.length - 1].push(value);
		}
		return new Table(rows);
	}

	static solve(upperBound: number) {
		const values = Problem149.prng(upperBound ** 2);
		const table = Problem149.wrapByRows(values, upperBound);
		return Problem149.maxSubsequenceInTable(table);
	}
}

// console.time();
// console.log(Problem149.solve(2000));
// console.timeEnd();
// debugger;
