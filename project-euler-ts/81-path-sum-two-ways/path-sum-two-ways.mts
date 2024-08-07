import { Field } from "../../utils-ts/modules/math/Field.mjs";
import { Matrix } from "../../utils-ts/modules/math/Matrix.mjs";
import { Utils } from "../../utils-ts/modules/Utils.mjs";
import { MATRIX_DATA } from "./matrix-data.mjs";
import { TEST_MATRIX_DATA } from "./test-matrix-data.mjs";

const MATRIX = new Matrix(80, 80, Field.REALS, MATRIX_DATA);

const pathSum = Utils.memoize((row: number, column: number): number => {
	if(row === MATRIX.height - 1 && column === MATRIX.width - 1) {
		return MATRIX.get(row, column);
	}
	else if(row === MATRIX.height - 1) {
		return MATRIX.get(row, column) + pathSum(row, column + 1);
	}
	else if(column === MATRIX.width - 1) {
		return MATRIX.get(row, column) + pathSum(row + 1, column);
	}
	else {
		return MATRIX.get(row, column) + Math.min(pathSum(row + 1, column), pathSum(row, column + 1));
	}
});
// console.log(pathSum(0, 0));
// debugger;
// console.log(pathSum(0, 0));
