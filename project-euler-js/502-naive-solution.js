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
	blockWidth(x, y) {
		if(this.heights[x] < y) { return 0; }
		let distanceRight = 0;
		let distanceLeft = 0;
		for(let x2 = x - 1; this.heights[x2] > y; x2 --) {
			distanceLeft ++;
		}
		for(let x2 = x + 1; this.heights[x2] > y; x2 ++) {
			distanceRight ++;
		}
		return distanceLeft + distanceRight + 1;
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
			if((parity == null || castle.parity() === parity) && castle.usesFullHeight() === usesFullHeight) {
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

	visualize(gridSize, color = "blue") {
		const width = this.width * gridSize;
		const height = this.height * gridSize;
		const canvas = document.createElement("canvas");
		canvas.width = width, canvas.height = height;
		canvas.style.width = `${width}px`, canvas.style.height = `${height}px`;
		const ctx = canvas.getContext("2d");
		ctx.strokeStyle = "rgb(200, 200, 200)";
		ctx.lineWidth = 1;
		ctx.strokeRect(0, 0, width, height);
		ctx.lineWidth = 3;
		if(color === "blue") {
			ctx.strokeStyle = "rgb(0, 0, 255)";
			ctx.fillStyle = "rgb(200, 200, 255)";
		}
		else if(color === "red") {
			ctx.strokeStyle = "rgb(255, 0, 0)";
			ctx.fillStyle = "rgb(255, 200, 200)"
		}
		for(let blockX = 0; blockX < this.width; blockX ++) {
			const heightAtPos = this.heights[blockX];
			if(heightAtPos > (this.heights[blockX - 1] ?? 0)) {
				for(let blockY = (this.heights[blockX - 1] ?? 0) + 1; blockY <= heightAtPos; blockY ++) {
					let blockWidth = this.heights.slice(blockX).findIndex(h => h < blockY);
					if(blockWidth === -1) { blockWidth = this.width - blockX; }
					const rectPos = [
						(blockX * gridSize),
						height - (blockY) * gridSize,
						blockWidth * gridSize,
						gridSize
					];
					ctx.fillRect(...rectPos);
					ctx.strokeRect(...rectPos);
				}
			}
		}
		return canvas;
	}
	static visualize(width, height, centralized = null, parity = "even", usesFullHeight = true) {
		const GRID_SIZE = 20;
		let castles = [];
		for(const castle of Castle.allCastles(width, height)) {
			if(
				(centralized == null || castle.isCentralized() === centralized) &&
				(parity == null || castle.parity() === parity) &&
				(usesFullHeight == null || castle.usesFullHeight() === usesFullHeight)
			) {
				castles.push(castle);
			}
		}
		const centralX = Math.floor(width / 2);
		castles = castles.sort((a, b) => a.blockWidth(centralX, 1) - b.blockWidth(centralX, 1));
		for(const castle of castles) {
			document.body.appendChild(castle.visualize(GRID_SIZE));
		}
	}

	pathString() {
		let string = ``;
		for(let x = 0; x < this.width; x ++) {
			const difference = this.heights[x] - (this.heights[x - 1] ?? 0);
			if(difference > 0) {
				string += "U".repeat(difference);
			}
			else if(difference < 0) {
				string += "D".repeat(-difference);
			}
			string += "R";
		}
		string += "D".repeat(this.heights[this.heights.length - 1]);
		return string;
	}
	formatString() {
		return [...this.pathString()].filter(dir => dir !== "R").join("");
	}
}

testing.addUnit("Castle.numBlocks()", {
	"returns the correct number for the castle in the Project Euler problem": () => {
		const castle = new Castle(
			8, 5,
			[2, 3, 5, 2, 3, 1, 5, 4]
		);
		expect(castle.numBlocks()).toEqual(10);
	}
});
testing.addUnit("Castle.pathString()", {
	"returns the correct format string": () => {
		const castle = new Castle(5, 2, [2, 1, 2, 1, 2]);
		const string = castle.pathString();
		expect(string).toEqual(`UURDRURDRURDD`);
	}
});
testing.addUnit("Castle.formatString()", {
	"returns the correct format string": () => {
		const castle = new Castle(5, 2, [2, 1, 2, 1, 2]);
		const string = castle.formatString();
		expect(string).toEqual(`UUDUDUDD`);
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
	// "returns the correct result for a 13x10 rectangle": () => {
	// 	expect(Castle.numCastles(13, 10)).toEqual(3729050610636);
	// },
	// "returns the correct result for a 10x13 rectangle": () => {
	// 	expect(Castle.numCastles(10, 13)).toEqual(37959702514);
	// },
	// "returns the correct result for a 100x100 rectangle": () => {
	// 	expect(Castle.numCastles(100, 100, 1000000007)).toEqual(841913936);
	// }
});

const WIDTH = 11;
const HEIGHT = 2;
Castle.visualize(WIDTH, HEIGHT, null, "even", true);
console.log(`${Castle.numCastles(WIDTH, HEIGHT, Infinity, "even", true)} / ${Castle.numCastles(WIDTH, HEIGHT, Infinity, null, true)}`);
for(let w = 1; w <= WIDTH; w ++) {
	console.log(`even proportion for ${w}x${HEIGHT} is ${Castle.numCastles(w, HEIGHT, Infinity, "even", true)} / ${Castle.numCastles(w, HEIGHT, Infinity, null, true)}`);
}

// const testCases = new Grid(5, 5).map((v, x, y) => new Vector(x + 1, y + 1)).rows.flat(100);
// const timePolynomial = utils.time.extrapolate(
// 	(vector) => {
// 		const [x, y] = vector.numbers;
// 		return Castle.numCastles(x, y, Infinity);
// 	},
// 	"a * h^(b * w + c) * w * h + d * w * h + e * w * h + f",
// 	["w", "h"],
// 	testCases,
// 	5
// );
// const time1 = timePolynomial.substitute(["w", "h"], [100, 1e12]).simplify();
// const time2 = timePolynomial.substitute(["w", "h"], [10000, 10000]).simplify();
// const time3 = timePolynomial.substitute(["w", "h"], [1e12, 100]).simplify();
// const totalTime = time1 + time2 + time3;
