const findComplexity = (grid) => {
	const sequences = [];
	for(const sequence of [...grid.rows, ...grid.columns()]) {
		if(!sequences.some(s => s.every((bit, index) => bit === sequence[index]))) {
			sequences.push(sequence);
		}
	}
	return sequences.length;
};
const distinctRows = (grid) => {
	const result = [];
	for(const row of grid.rows) {
		if(!result.some(s => s.equals(row))) {
			result.push(row);
		}
	}
	return result;
};
const distinctColumns = (grid) => {
	const result = [];
	for(const column of grid.columns()) {
		if(!result.some(s => s.equals(column))) {
			result.push(column);
		}
	}
	return result;
};
testing.addUnit("findComplexity()", {
	"works for the first example from Project Euler": () => {
		const grid = new Grid([
			[1, 0, 1],
			[0, 0, 0],
			[1, 0, 1]
		]);
		const complexity = findComplexity(grid);
		expect(complexity).toEqual(2);
	},
	"works for the second example from Project Euler": () => {
		const grid = new Grid([
			[0, 0, 0],
			[0, 0, 0],
			[1, 1, 1]
		]);
		const complexity = findComplexity(grid);
		expect(complexity).toEqual(3);
	},
});

const subsetsOfSize = function*(set, subsetSize) {
	if(subsetSize === 0) {
		yield new Set([]);
	}
	else if(subsetSize === set.size) {
		yield set;
	}
	else {
		const elements = [...set];
		const setMinusFirst = new Set(set);
		setMinusFirst.delete(elements[0]);
		for(const subset of subsetsOfSize(setMinusFirst, subsetSize - 1)) {
			yield new Set([elements[0], ...subset]);
		}
		for(const subset of subsetsOfSize(setMinusFirst, subsetSize)) {
			yield subset;
		}
	}
};
testing.addUnit("subsetsOfSize()", {
	"correctly yields all subsets of the given size": () => {
		const set = new Set([1, 2, 3]);
		const subsets = [...subsetsOfSize(set, 2)];
		expect(subsets).toEqual([
			new Set([1, 2]),
			new Set([1, 3]),
			new Set([2, 3])
		]);
	}
});
const binaryGrids = function*(size, numOnes) {
	const numbers = new Set(Math.integersBetween(0, size ** 2 - 1));
	for(const subset of subsetsOfSize(numbers, numOnes)) {
		const grid = new Grid(size, size, 0);
		for(const number of subset) {
			grid.set(Math.floor(number / size), number % size, 1);
		}
		yield grid;
	}
};

const minComplexity = (size, numOnes) => {
	if(size === 6 && numOnes === 14) { debugger; }
	/* Condition checks for c=1 (necessary and sufficient) */
	if(numOnes === 0 || numOnes === size ** 2) { return 1; }

	/* Condition checks for c=2 (necessary and sufficient) */
	const xValues = [
		(size + Math.sqrt(Math.abs(2 * numOnes - size ** 2))) / 2,
		(size - Math.sqrt(Math.abs(2 * numOnes - size ** 2))) / 2,
		size + Math.sqrt(size ** 2 - numOnes),
		size - Math.sqrt(size ** 2 - numOnes),
		Math.sqrt(numOnes)
	];
	if(xValues.some(x => x % 1 === 0 && x >= 0 && x <= size)) {
		return 2;
	}

	/* Condition checks for c=3 (sufficient, but not necessary) */
	for(let i = 1; i * i <= numOnes; i ++) {
		if(numOnes % i === 0 && i <= size && numOnes / i <= size) {
			return 3;
		}
	}
	for(let i = 1; i * i <= (size ** 2 - numOnes); i ++) {
		if((size ** 2 - numOnes) % i === 0 && i <= size && (size ** 2 - numOnes) / i <= size) {
			return 3;
		}
	}
	for(let a = 1; a * a <= numOnes; a ++) {
		for(let b = 1; a ** 2 + 2 * a * b <= numOnes; b ++) {
			if(a ** 2 + 2 * a * b === numOnes) {
				return 3;
			}
		}
	}
	for(let a = 1; a * a <= (size ** 2 - numOnes); a ++) {
		for(let b = 1; a ** 2 + 2 * a * b <= (size ** 2 - numOnes); b ++) {
			if(a ** 2 + 2 * a * b === (size ** 2 - numOnes)) {
				return 3;
			}
		}
	}

	/* Run the brute-force algorithm */
	console.log(`%cc(${size}, ${numOnes}) might be 4`, `color: orange`);
	for(const grid of binaryGrids(size, numOnes)) {
		if(findComplexity(grid) === 3) { return 3; }
	}
	return 4;
};

const testConjecture = (maxSize) => {
	for(let size = 1; size <= maxSize; size ++) {
		for(let numOnes = 0; numOnes <= size ** 2; numOnes ++) {
			const complexity = minComplexity(size, numOnes);
			if(complexity === 4) {
				console.log(`%cFound a counterexample: c(${size}, ${numOnes}) = 4.`);
				return;
			}
			else {
				// console.log(`%cc(${size}, ${numOnes}) = ${complexity}`, `color: green`);
			}
		}
	}
};
const testConjecture2 = (maxSize) => {
	// for(let size = 1; size <= maxSize; size ++) {
		// for(let numOnes = 0; numOnes <= size ** 2; numOnes ++) {
		for(let numOnes = 0; numOnes <= maxSize ** 2; numOnes ++) {
			// for(const grid of binaryGrids(size, numOnes)) {
			for(const grid of binaryGrids(maxSize, numOnes)) {
				const rows = distinctRows(grid);
				const columns = distinctColumns(grid);
				const complexity = findComplexity(grid);
				if(rows.length === 2 && columns.length === 2 && complexity === 3) {
					console.log(grid.rows);
				}
			}
		}
	// }
	console.log(`No grids found.`);
};
