import { Field } from "./Field";

export class Matrix<FieldElementType> {
	width: number;
	height: number;
	field: Field<FieldElementType>;
	private rows: Map<number, Map<number, FieldElementType>>; // uses maps instead of arrays so we can only store nonzero entries (for high performance)

	constructor(width: number, height: number, field: Field<FieldElementType>, values: FieldElementType[][] = []) {
		this.field = field;
		this.width = width;
		this.height = height;
		this.rows = new Map();
		for(const [rowIndex, row] of values.entries()) {
			for(const [columnIndex, value] of row.entries()) {
				this.set(rowIndex, columnIndex, value);
			}
		}
	}
	get(row: number, column: number): FieldElementType {
		if(!this.rows.get(row)) { return this.field.zero; }
		return this.rows.get(row)!.get(column) ?? this.field.zero;
	}
	set(rowIndex: number, column: number, value: FieldElementType) {
		if(value === this.field.zero) {
			const row = this.rows.get(rowIndex);
			if(row) {
				row.delete(column);
				if(row.size === 0) {
					this.rows.delete(rowIndex);
				}
			}
		}
		else {
			let row = this.rows.get(rowIndex);
			if(!row) {
				this.rows.set(rowIndex, row = new Map());
			}
			row.set(column, value);
		}
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

	*nonzeroEntries(): Generator<[number, number, FieldElementType]> {
		for(const [rowIndex, row] of this.rows.entries()) {
			for(const [columnIndex, value] of row.entries()) {
				yield [rowIndex, columnIndex, value];
			}
		}
	}

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
		for(const [row, column, value] of matrix.nonzeroEntries()) {
			this.set(row, column, this.field.subtract(this.get(row, column), value));
		}
	}
}
