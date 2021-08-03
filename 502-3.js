const numCastles = ((width, height, parity = "even", includeLeftBlocks = true, includeRightBlocks = true, includeFoundation = true) => {
	width = BigInt(width);
	height = BigInt(height);
	if(includeFoundation) {
		return numCastles(width, height - 1n, parity, includeLeftBlocks, includeRightBlocks, false);
	}

	if(width <= 0n || height <= 0n) { return 0n; }
	if(width === 1n) {
		if((!includeLeftBlocks || !includeRightBlocks) && parity === "odd") { return 0n; }
		return ((parity === "even") === (height % 2n === 0n)) ? 1n : 0n;
	}
	if(height === 1n) {
		
	}

	let result = 0n;
	for(let firstFullColumn = 0n; firstFullColumn < width; firstFullColumn ++) {
		const parityCombinations = (
			(parity === "even") === (height % 2n === 0n)
			? [["even", "even"], ["odd", "odd"]]
			: [["even", "odd"], ["odd", "even"]]
		);
		for(const [leftParity, rightParity] of parityCombinations) {
			let leftCastles = 0n;
			for(let h = 1n; h < height; h ++) {
				leftCastles += numCastles(
					firstFullColumn, height,
					leftParity, includeLeftBlocks, false, false
				);
			}
			let rightCastles = 0n;
			for(let h = 1n; h <= height; h ++) {
				rightCastles += numCastles(
					width - firstFullColumn - 1n, h,
					rightParity, false, includeRightBlocks, false
				);
			}
			result += leftCastles * rightCastles;
		}
	}
	return result;
}).memoize();

testing.addUnit("numCastles()", {
	/* test cases from Project Euler */
	"returns the correct result for a 4x2 rectangle": () => {
		expect(numCastles(4, 2)).toEqual(10n);
	},
	"returns the correct result for a 13x10 rectangle": () => {
		expect(numCastles(13, 10)).toEqual(3729050610636n);
	},
	"returns the correct result for a 10x13 rectangle": () => {
		expect(numCastles(10, 13)).toEqual(37959702514n);
	},
	"returns the correct result for a 100x100 rectangle": () => {
		expect(numCastles(100, 100, 1000000007)).toEqual(841913936n);
	},
	/* other test cases */
	"returns the correct result for a 10x2 non-full-height rectangle": () => {
		expect(numCastles(10, 2, Infinity, "even", false)).toEqual(0n);
	},
	"returns the correct result for a 2x2 non-full-height odd-parity rectangle": () => {
		const result = numCastles(2n, 2n, Infinity, "odd", false);
		expect(result).toEqual(1n);
	},
	"returns the correct result for a 5x2 rectangle": () => {
		const result = numCastles(5, 2);
		expect(result).toEqual(16);
	},
	"returns the correct result for a 3x3 rectangle": () => {
		const result = numCastles(3, 3);
		expect(result).toEqual(3);
	},
	"returns the correct result for a 4x3 rectangle": () => {
		const result = numCastles(4, 3);
		expect(result).toEqual(21);
	},
	"returns the correct result for a 5x3 rectangle": () => {
		const result = numCastles(5, 3);
		expect(result).toEqual(89);
	},
	"returns the correct result for a 4x4 rectangle": () => {
		const result = numCastles(4, 4);
		expect(result).toEqual(117);
	},

	"returns the correct result for a 2x3 odd-parity rectangle": () => {
		const result = numCastles(2n, 3n, Infinity, "odd", true);
		expect(result).toEqual(5n);
	},
	"returns the correct result for a 2x3 rectangle": () => {
		const result = numCastles(2n, 3n);
		expect(result).toEqual(0n);
	},
	"returns the correct result for a 2x3 non-full-height rectangle": () => {
		const result = numCastles(2n, 3n, Infinity, "even", false);
		expect(result).toEqual(3n);
	},
	"returns the correct result for a 2x3 odd-parity non-full-height rectangle": () => {
		const result = numCastles(2n, 3n, Infinity, "odd", false);
		expect(result).toEqual(1n);
	},
	"returns the correct result for a 2x2 rectangle": () => {
		const result = numCastles(2n, 2n);
		expect(result).toEqual(3n);
	},
	"returns the correct result for a 2x2 non-full-height rectangle": () => {
		const result = numCastles(2n, 2n, Infinity, "even", false);
		expect(result).toEqual(0n);
	},
	"returns the correct result for a 2x2 odd-parity rectangle": () => {
		const result = numCastles(2n, 2n, Infinity, "odd", true);
		expect(result).toEqual(0n);
	},

	"returns the correct result for a 2x4 rectangle": () => {
		const result = numCastles(2n, 4n);
		expect(result).toEqual(7n);
	},
	"returns the correct result for a 5x3 non-full-height rectangle": () => {
		const result = numCastles(5n, 3n, Infinity, "even", false);
		expect(result).toEqual(16n);
	},
	"returns the correct result for a 7x4 rectangle": () => {
		const result = numCastles(7n, 4n);
		expect(result).toEqual(7063n);
	},
});
// testing.testAll();
testing.runTestByName("numCastles() - returns the correct result for a 4x2 rectangle");
