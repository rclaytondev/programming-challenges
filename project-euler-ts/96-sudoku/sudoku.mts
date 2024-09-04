
// type _TupleOf<T, N extends number, R extends unknown[]> = R["length"] extends N ? R : _TupleOf<T, N, [T, ...R]>;
// type Tuple<T, N extends number> = N extends N ? number extends N ? T[] : _TupleOf<T, N, []> : never;
// type Grid<T, N extends number> = Tuple<Tuple<T, N>, N>;

// type Digit = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
// type EmptyCell = 0;
// type SudokuGrid = Grid<Digit | EmptyCell, 9>;

import { Vector } from "../../utils-ts/modules/geometry/Vector.mjs";
import { Grid } from "../../utils-ts/modules/Grid.mjs";
import { Table } from "../../utils-ts/modules/Table.mjs";
import { CountLogger } from "../project-specific-utilities/CountLogger.mjs";
import { PUZZLES_DATA } from "./puzzles-data.mjs";

type Digit = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
type EmptyCell = 0;
const EMPTY_CELL = 0;
const DIGITS = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

const getPossibleValues = (sudoku: Table<Digit | EmptyCell>, position: Vector) => {
	const row = sudoku.getRow(position.y);
	const column = sudoku.getColumn(position.x);
	const subgrid = sudoku.slice(3 * Math.floor(position.x / 3), 3 * Math.floor(position.y / 3), 3, 3);
	return DIGITS.filter(d => !row.includes(d) && !column.includes(d) && !subgrid.includes(d));
};

const deduce = (sudoku: Table<Digit | EmptyCell>): void => {
	for(const [x, y, value] of sudoku.entries()) {
		if(value === EMPTY_CELL) {
			const possibleValues = getPossibleValues(sudoku, new Vector(x, y));
			// console.log(`possible values: [${possibleValues.join(", ")}]`);
			if(possibleValues.length === 1) {
				const [onlyPossibleValue] = 	possibleValues;
				sudoku.rows[y][x] = onlyPossibleValue;
				return deduce(sudoku);
			}
		}
	}
};

const solveSudoku = (sudoku: Table<Digit | EmptyCell>): Table<Digit | EmptyCell> | null => {
	const initial = sudoku.copy();
	deduce(sudoku);
	// console.log(toString(initial));
	// console.log("-----------------------");
	// console.log(toString(sudoku));
	// console.log(isCorrect(initial, sudoku));
	const nextPosition = sudoku.findPosition((v, x, y) => v === EMPTY_CELL);
	if(!nextPosition) { return sudoku; }
	for(const nextPossibleValue of getPossibleValues(sudoku, nextPosition)) {
		const solved = solveSudoku(sudoku.copyAndSet(nextPosition.x, nextPosition.y, nextPossibleValue));
		if(solved) {
			return solved;
		}
	}
	return null;
};

const solve = () => {
	const logger = new CountLogger(n => n, 50);
	const ALL_SUDOKU = PUZZLES_DATA.map(sudoku => new Table(sudoku as (Digit | EmptyCell)[][]));
	let sum = 0;
	for(const sudoku of ALL_SUDOKU) {
		// logger.count();
		const initial = sudoku.copy();
		const solved = solveSudoku(sudoku)!;
		console.log(isCorrect(initial, solved) && isComplete(solved));
		sum += solved.rows[0][0] + solved.rows[0][1] + solved.rows[0][2];
	}
	return sum;
};

const containsDuplicates = <T, >(array: T[]) => {
	return array.length !== new Set(array).size;
};

const isCorrect = (initial: Table<Digit | EmptyCell>, final: Table<Digit | EmptyCell>) => {
	for(const row of final.rows) {
		if(containsDuplicates(row.filter(v => v !== 0))) {
			debugger;
			return false;
		}
	}
	for(const column of final.columns()) {
		if(containsDuplicates(column.filter(v => v !== 0))) {
			debugger;
			return false;
		}
	}
	for(let x = 0; x < final.width; x += 3) {
		for(let y = 0; y < final.height; y += 3) {
			if(containsDuplicates([...final.slice(x, y, 3, 3)].filter(v => v !== 0))) {
				debugger;
				return false;
			}
		}
	}
	for(let [x, y, value] of initial.entries()) {
		if(final.rows[y][x] !== value && value !== 0) {
			debugger;
			return false;
		}
	}
	return true;
};

const toString = (sudoku: Table<Digit | EmptyCell>) => {
	return sudoku.map(v => v === 0 ? " " : `${v}`).rows.map(r => r.join(", ")).join("\n");
};

const isComplete = (sudoku: Table<Digit | EmptyCell>) => !sudoku.includes(EMPTY_CELL);

console.time();
console.log(solve());
console.timeEnd();
debugger;
