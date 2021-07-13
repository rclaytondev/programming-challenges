class Castle {
	constructor(width, height, heights) {
		this.width = width;
		this.height = height;
		this.heights = heights;
	}

	numBlocks() {
		let blocks = 0;
		for(const [index, height] of this.heights.entries()) {
			const previous = this.heights[index - 1] ?? 0;
			if(height - previous > 0) {
				blocks += (height - previous);
			}
		}
		return blocks;
	}

	isValid() {
		return (
			this.heights.every(h => h >= 1) &&
			this.heights.some(h => h === this.height) &&
			this.numBlocks() % 2 === 0
		);
	}

	static *allCastles(width, height) {
		const possibleHeights = new Set();
		for(let i = 1; i <= height; i ++) { possibleHeights.add(i); }
		for(const heights of Set.cartesianProductGenerator(...[possibleHeights].repeat(width))) {
			const castle = new Castle(width, height, heights);
			yield castle;
		}
	}

	static numCastles(width, height) {
		let castles = 0;
		for(const castle of Castle.allCastles(width, height)) {
			if(castle.isValid()) {
				castles ++;
			}
		}
		return castles;
	}
}

testing.addUnit("Castle.numBlocks()", {
	"returns the correct number for the castle in the Project Euler problem": () => {
		const castle = new Castle(
			5, 8,
			[2, 3, 5, 2, 3, 1, 5, 4]
		);
		expect(castle.numBlocks()).toEqual(10);
	}
});
testing.addUnit("Castle.numCastles()", {
	/* test cases from Project Euler */
	"returns the correct result for a 4x2 rectangle": () => {
		expect(Castle.numCastles(4, 2)).toEqual(10);
	},
	"returns the correct result for a 5x2 rectangle": () => {
		const result = Castle.numCastles(5, 2);
		expect(result).toEqual(16);
	},
	"returns the correct result for a 3x3 rectangle": () => {
		const result = Castle.numCastles(3, 3);
		expect(result).toEqual(3);
	},
	"returns the correct result for a 13x10 rectangle": () => {
		expect(Castle.numCastles(13, 10)).toEqual(3729050610636);
	},
	"returns the correct result for a 10x13 rectangle": () => {
		expect(Castle.numCastles(10, 13)).toEqual(37959702514);
	},
	"returns the correct result for a 100x100 rectangle": () => {
		expect(Castle.numCastles(100, 100, 1000000007)).toEqual(841913936);
	}
});
testing.runTestByName("Castle.numCastles() - returns the correct result for a 3x3 rectangle");
