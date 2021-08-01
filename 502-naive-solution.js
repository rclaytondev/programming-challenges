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
	parity() {
		return this.numBlocks() % 2 === 0 ? "even" : "odd";
	}
	usesFullHeight() {
		return this.heights.some(h => h === this.height);
	}
	isValid() {
		return this.heights.every(h => h >= 1) && this.parity() === "even" && this.usesFullHeight();
	}
	isCentralized() {
		if(this.width % 2 === 0) {
			return this.heights[this.width / 2] >= 2 && this.heights[this.width / 2 - 1] >= 2;
		}
		else {
			return this.heights[(this.width - 1) / 2] >= 2;
		}
	}

	static *allCastles(width, height) {
		const possibleHeights = new Set();
		for(let i = 1; i <= height; i ++) { possibleHeights.add(i); }
		for(const heights of Set.cartesianProductGenerator(...[possibleHeights].repeat(width))) {
			const castle = new Castle(width, height, heights);
			yield castle;
		}
	}

	static numCastles(width, height, modulo = Infinity, parity = "even", usesFullHeight = true) {
		if(width <= 0 || height <= 0) { return 0; }
		let castles = 0;
		for(const castle of Castle.allCastles(width, height)) {
			if(castle.parity() === parity && castle.usesFullHeight() === usesFullHeight) {
				castles ++;
			}
		}
		return castles % modulo;
	}
	static centralizedCastles(width, height, modulo = Infinity, parity = "even", usesFullHeight = true) {
		if(width <= 0 || height <= 0) { return 0; }
		let castles = 0;
		for(const castle of Castle.allCastles(width, height)) {
			if(castle.isCentralized() && castle.parity() === parity && castle.usesFullHeight() === usesFullHeight) {
				castles ++;
			}
		}
		return castles % modulo;
	}
	static decentralizedCastles(width, height, modulo = Infinity, parity = "even", usesFullHeight = true) {
		if(width <= 0 || height <= 0) { return 0; }
		let castles = 0;
		for(const castle of Castle.allCastles(width, height)) {
			if(!castle.isCentralized() && castle.parity() === parity && castle.usesFullHeight() === usesFullHeight) {
				castles ++;
			}
		}
		return castles % modulo;
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
