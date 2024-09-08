import { Vector } from "../../utils-ts/modules/geometry/Vector.mjs";
import { Utils } from "../../utils-ts/modules/Utils.mjs";

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
		const result = new VectorSet();
		const rowStartIndexIndex = Utils.binaryIndexOf(top, this.nonemptyRowIndices, "last");
		for(let i = rowStartIndexIndex; i < this.nonemptyRowIndices.length && this.nonemptyRowIndices[i] <= bottom; i ++) {
			const y = this.nonemptyRowIndices[i];
			const row = this.rows.get(y)!;
			const startIndex = Utils.binaryIndexOf(left, row, "last");
			for(let xIndex = startIndex; xIndex < row.length && row[xIndex] <= right; xIndex ++) {
				result.add(new Vector(row[xIndex], y));
			}
		}
		return result;
	}
}
