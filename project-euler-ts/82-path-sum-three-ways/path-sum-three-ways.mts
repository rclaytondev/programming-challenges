import { ArrayUtils } from "../../utils-ts/modules/core-extensions/ArrayUtils.mjs";
import { Field } from "../../utils-ts/modules/math/Field.mjs";
import { MathUtils } from "../../utils-ts/modules/math/MathUtils.mjs";
import { Matrix } from "../../utils-ts/modules/math/Matrix.mjs";
import { Utils } from "../../utils-ts/modules/Utils.mjs";
import { MATRIX_DATA } from "../81-path-sum-two-ways/matrix-data.mjs";
import { TEST_MATRIX_DATA } from "../81-path-sum-two-ways/test-matrix-data.mjs";

const MATRIX = new Matrix(80, 80, Field.REALS, MATRIX_DATA);
// const MATRIX = new Matrix(5, 5, Field.REALS, TEST_MATRIX_DATA);

const columnSumBetween = (column: number, startRow: number, endRow: number) => 
	MathUtils.sum(ArrayUtils.range(startRow, endRow).map(row => MATRIX.get(row, column)));

const pathSum = Utils.memoize((row: number, column: number): number => {
	if(column === MATRIX.width - 1) {
		return MATRIX.get(row, column);
	}
	const values = [];
	for(let nextRow = 0; nextRow < MATRIX.height; nextRow ++) {
		values.push(columnSumBetween(column, row, nextRow) + pathSum(nextRow, column + 1));
	}
	return Math.min(...values);
});
const solve = () => {
	const values = [];
	for(let row = 0; row < MATRIX.height; row ++) {
		values.push(pathSum(row, 0));
	}
	return Math.min(...values);
};
// console.log(solve());
// debugger;
