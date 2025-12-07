import { ArrayUtils } from "../../utils-ts/modules/core-extensions/ArrayUtils.mjs";
import { Vector } from "../../utils-ts/modules/geometry/Vector.mjs";

const sortedInsertUnique = (value: number, array: number[]) => {
	for(let i = 0; i < array.length; i ++) {
		if(value === array[i]) { return; }
		if(value < array[i]) {
			array.splice(i, 0, value);
			return;
		}
	}
	array.push(value);
};
const deleteFirst = <T, >(value: T, array: T[]) => {
	for(let i = 0; i < array.length; i ++) {
		if(array[i] === value) {
			array.splice(i, 1);
			return;
		}
	}
};

export class VectorSet {
	/* 
	Represents a set of 2D vectors, stored in a data structure that allows you to efficiently get all the vectors within a rectangle.
	*/

	private nonemptyRowIndices: number[];
	private rows: Map<number, number[]>;

	constructor(rows: Map<number, number[]> = new Map(), nonemptyRowIndices: number[] = []) {
		this.rows = rows;
		this.nonemptyRowIndices = nonemptyRowIndices;
	}
	static fromIterable(vectors: Iterable<Vector>) {
		const result = new VectorSet();
		for(const vector of vectors) {
			result.add(vector);
		}
		return result;
	}

	add(vector: Vector) {
		if(!this.rows.has(vector.y)) {
			this.rows.set(vector.y, [vector.x]);
			sortedInsertUnique(vector.y, this.nonemptyRowIndices);
		}
		else {
			sortedInsertUnique(vector.x, this.rows.get(vector.y)!);
		}
	}
	delete(vector: Vector) {
		const row = this.rows.get(vector.y);
		if(row) {
			deleteFirst(vector.x, row);
			if(row.length === 0) {
				deleteFirst(vector.y, this.nonemptyRowIndices);
			}
		}
	}
	has(vector: Vector) {
		const row = this.rows.get(vector.y);
		if(!row) { return false; }
		return row.includes(vector.x);
	}
	*[Symbol.iterator]() {
		for(const [y, row] of this.rows.entries()) {
			for(const x of row) {
				yield new Vector(x, y);
			}
		}
	}

	slice(left: number, right: number, top: number, bottom: number): VectorSet {
		const resultRows = new Map<number, number[]>();
		const resultRowIndices = [];
		const rowStartIndexIndex = ArrayUtils.binaryIndexOf(top, this.nonemptyRowIndices, "last");
		for(let i = rowStartIndexIndex; i < this.nonemptyRowIndices.length && this.nonemptyRowIndices[i] <= bottom; i ++) {
			const y = this.nonemptyRowIndices[i];
			const newRow = [];
			resultRowIndices.push(y);
			const row = this.rows.get(y)!;
			const startIndex = ArrayUtils.binaryIndexOf(left, row, "last");
			for(let xIndex = startIndex; xIndex < row.length && row[xIndex] <= right; xIndex ++) {
				newRow.push(row[xIndex]);
			}
			resultRows.set(y, newRow);
		}
		return new VectorSet(resultRows, resultRowIndices);
	}
}
