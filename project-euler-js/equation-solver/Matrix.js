class Matrix {
	constructor(grid) {
		if(!(grid instanceof Grid)) {
			grid = new Grid(grid);
		}
		testing.assert(grid.every(value => typeof value === "number"));
		this.grid = grid;
	}

	multiply() {
		if(typeof arguments[0] === "number") {
			const [scalar] = arguments;
			return new Matrix(this.grid.map(number => number * scalar));
		}
		else if(arguments[0] instanceof Matrix) {
			const [matrix] = arguments;
			testing.assert(this.grid.width() === matrix.grid.height());


			const dotProduct = (nums1, nums2) => nums1.map((v, i) => v * nums2[i]).sum();
			const resultGrid = new Grid(matrix.grid.width(), this.grid.height());
			const matrixColumns = matrix.grid.columns();
			this.grid.rows.forEach((row, y) => {
				matrixColumns.forEach((column, x) => {
					resultGrid.set(x, y, dotProduct(row, column));
				});
			});
			return new Matrix(resultGrid);
		}
		else {
			throw new Error("Invalid usage.");
		}
	}


	inverse() {
		/* returns the inverse of this matrix, or null if there is no inverse. */
		return this.adjugate().multiply(1 / this.determinant());
	}
	determinant() {
		/* used in calculating the matrix of minors. */
		if(this.grid.width() !== this.grid.height()) {
			throw new Error("Determinant can only be calculated for a square matrix.");
		}


		if(this.grid.width() === 1) {
			return this.grid.get(0, 0);
		}
		else if(this.grid.width() === 2) {
			const [[topLeft, topRight], [bottomLeft, bottomRight]] = this.grid.rows;
			return (topLeft * bottomRight) - (topRight * bottomLeft);
		}
		else {
			let result = 0;
			const firstRowRemoved = this.grid.removeRow(0);
			for(let x = 0; x < this.grid.width(); x ++) {
				const value = this.grid.get(x, 0);
				const notInRowOrColumn = new Matrix(firstRowRemoved.removeColumn(x));
				if(x % 2 === 0) {
					result += value * notInRowOrColumn.determinant();
				}
				else {
					result -= value * notInRowOrColumn.determinant();
				}
			}
			return result;
		}
	}
	matrixOfMinors() {
		/* used in calculating the inverse of the matrix. */
		return new Matrix(this.grid.map((value, x, y) => {
			const notInRowOrColumn = this.grid.removeRow(y).removeColumn(x);
			return new Matrix(notInRowOrColumn).determinant();
		}));
	}
	matrixOfCofactors() {
		const minors = this.matrixOfMinors();
		return new Matrix(minors.grid.map((value, x, y) => {
			if((x + y) % 2 === 0) {
				return value;
			}
			else {
				return -value;
			}
		}));
	}
	adjugate() {
		const cofactors = this.matrixOfCofactors();
		return new Matrix(cofactors.grid.map((value, x, y) => {
			return cofactors.grid.get(y, x);
		}));
	}
}

testing.addUnit("Matrix.multiply()", {
	"can multiply by a scalar": () => {
		const result = new Matrix([[1, 2], [3, 4]]).multiply(5);
		expect(result).toEqual(new Matrix([[5, 10], [15, 20]]));
	},
	"can multiply by another matrix - test case 1": () => {
		const matrix1 = new Matrix([
			[1, 2, 3]
		]);
		const matrix2 = new Matrix([
			[4],
			[5],
			[6]
		]);
		const expected = new Matrix([
			[32]
		]);
		expect(matrix1.multiply(matrix2)).toEqual(expected);
	},
	"can multiply by another matrix - test case 2": () => {
		const matrix1 = new Matrix([
			[4],
			[5],
			[6]
		]);
		const matrix2 = new Matrix([
			[1, 2, 3]
		]);
		const expected = new Matrix([
			[4 * 1, 4 * 2, 4 * 3],
			[5 * 1, 5 * 2, 5 * 3],
			[6 * 1, 6 * 2, 6 * 3]
		]);
		expect(matrix1.multiply(matrix2)).toEqual(expected);
	},
	"can multiply by another matrix - test case 3": () => {
		const matrix1 = new Matrix([
			/* identity matrix -- multiplying another matrix by this leaves it unchanged */
			[1, 0, 0],
			[0, 1, 0],
			[0, 0, 1]
		]);
		const matrix2 = new Matrix([
			[1, 2, 3],
			[4, 5, 6],
			[7, 8, 9]
		]);
		expect(matrix1.multiply(matrix2)).toEqual(matrix2);
		expect(matrix2.multiply(matrix1)).toEqual(matrix2);
	},
	"can multiply by another matrix - test case 4": () => {
		const matrix1 = new Matrix([
			[1, 2, 3],
			[4, 5, 6]
		]);
		const matrix2 = new Matrix([
			[7, 8],
			[9, 10],
			[11, 12]
		]);
		const expected = new Matrix([
			[1 * 7 + 2 * 9 + 3 * 11, 1 * 8 + 2 * 10 + 3 * 12],
			[4 * 7 + 5 * 9 + 6 * 11, 4 * 8 + 5 * 10 + 6 * 12]
		]);
		expect(matrix1.multiply(matrix2)).toEqual(expected);
	}
});
testing.addUnit("Matrix.determinant()", [
	(matrix) => matrix.determinant(),
	[
		new Matrix([
			[1, 2],
			[3, 4]
		]),
		(1 * 4) - (2 * 3)
	],
	[
		new Matrix([
			[2, -3, 1],
			[4, 2, -1],
			[-5, 3, -2]
		]),
		-19
	]
]);
testing.addUnit("Matrix.matrixOfMinors()", [
	(matrix) => matrix.matrixOfMinors(),
	[
		new Matrix([
			[3, 0, 2],
			[2, 0, -2],
			[0, 1, 1]
		]),
		new Matrix([
			[2, 2, 2],
			[-2, 3, 3],
			[0, -10, 0]
		])
	]
]);
testing.addUnit("Matrix.matrixOfCofactors()", [
	(matrix) => matrix.matrixOfCofactors(),
	[
		new Matrix([
			[3, 0, 2],
			[2, 0, -2],
			[0, 1, 1]
		]),
		new Matrix([
			[2, -2, 2],
			[2, 3, -3],
			[0, 10, 0]
		])
	]
]);
testing.addUnit("Matrix.adjugate()", [
	(matrix) => matrix.adjugate(),
	[
		new Matrix([
			[3, 0, 2],
			[2, 0, -2],
			[0, 1, 1]
		]),
		new Matrix([
			[2, 2, 0],
			[-2, 3, 10],
			[2, -3, 0]
		])
	]
]);
testing.addUnit("Matrix.inverse()", [
	() => {
		const result = new Matrix([
			[3, 0, 2],
			[2, 0, -2],
			[0, 1, 1]
		]).inverse();
		const expectedResult = new Matrix([
			[0.2, 0.2, 0],
			[-0.2, 0.3, 1],
			[0.2, -0.3, 0]
		]);
		result.grid.forEach((value, x, y) => {
			expect(value).toApproximatelyEqual(expectedResult.grid.get(x, y));
		});
	}
]);
