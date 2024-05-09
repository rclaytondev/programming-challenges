import { Field } from "./Field";

export class Matrix<FieldElementType> {
	width: number;
	height: number;
	field: Field<FieldElementType>;
	private rows: FieldElementType[][]; // only contains nonzero entries, unless they're added

	constructor(width: number, height: number, field: Field<FieldElementType>) {
		this.field = field;
		this.width = width;
		this.height = height;
		this.rows = [];
	}
	get(row: number, column: number): FieldElementType {
		if(!this.rows[row]) { return this.field.zero; }
		return this.rows[row][column] ?? this.field.zero;
	}
	set(row: number, column: number, value: FieldElementType) {
		this.rows[row] ??= [];
		this.rows[row][column] = value;
	}

	// static multiply<FieldElementType>(matrix1: Matrix<FieldElementType>, matrix2: Matrix<FieldElementType>): Matrix<FieldElementType> {
	// 	if(matrix1.field !== matrix2.field) {
	// 		throw new Error("Cannot multiply matrices over different fields.");
	// 	}
	// 	if(matrix1.width !== matrix2.height) {
	// 		throw new Error(`In order to multiply matrices, the width of the first matrix must equal the height of the second, but in this case, the width of the first matrix was ${matrix1.width} whereas the height of the second matrix was ${matrix2.height}`);
	// 	}

	// 	const field = matrix1.field;
	// 	const result = new Matrix(matrix2.width, matrix1.height, field);
	// 	for(let rowIndex = )
	// }

	// nonzeroEntries*() {

	// }

	static identity<FieldElementType>(field: Field<FieldElementType>, size: number) {
		const result = new Matrix(size, size, field);
		for(let i = 0; i < size; i ++) {
			result.set(i, i, field.one);
		}
		return result;
	}
	inverse(): Matrix<FieldElementType> | null {
		const inverse = Matrix.identity(this.field, this.width);
	}
	subtract(matrix: Matrix<FieldElementType>) {
		
	}
}
