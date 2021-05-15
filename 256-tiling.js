class Tiling {
	constructor() {
		/* Each tiling is a grid, with each value being either:
		- null, meaning there is no tile at that position
		- "U" / "D" / "L" / "R", (up / down / left / right) meaning there is a
		tile connected to an adjacent tile in that direction.

		For example, the following grid:
		["R", "L", "D"],
		["R", "L", "U"]
		would represent a 3x2 tiling consisting of two horizontal rectangles
		on top of each other, with a vertical rectangle to their right.
		*/
		if(arguments[0] instanceof Grid) {
			const [grid] = arguments;
			this.grid = grid;
		}
		else if(typeof arguments[0] === "number" && typeof arguments[1] === "number") {
			const [width, height] = arguments;
			this.grid = new Grid(width, height, null);
		}
	}

	isValid() {
		/* returns whether this tiling meets the criteria that there are no
		points where three or more corners meet. */
		for(let x = 0; x < this.grid.width() - 1; x ++) {
			for(let y = 0; y < this.grid.height() - 1; y ++) {
				const corners = [
					["U", "L"].includes(this.grid.get(x, y)),
					["U", "R"].includes(this.grid.get(x + 1, y)),
					["D", "L"].includes(this.grid.get(x, y + 1)),
					["D", "R"].includes(this.grid.get(x + 1, y + 1))
				];
				if(corners.count(true) >= 3) {
					return false;
				}
			}
		}
		return true;
	}

	canAddTile(x, y, orientation) {
		if(orientation === "horizontal") {
			return (
				this.grid.get(x, y) === null &&
				x + 1 < this.grid.width() &&
				this.grid.get(x + 1, y) === null
			);
		}
		else if(orientation === "vertical") {
			return (
				this.grid.get(x, y) === null &&
				y + 1 < this.grid.height() &&
				this.grid.get(x, y + 1) === null
			);
		}
	}
	addTile(x, y, orientation) {
		const result = this.clone();
		if(orientation === "horizontal") {
			const value1 = this.grid.get(x, y);
			const value2 = this.grid.get(x + 1, y);
			if(value1 === null && value2 === null) {
				result.grid.set(x, y, "R");
				result.grid.set(x + 1, y, "L");
			}
			return result;
		}
		else if(orientation === "vertical") {
			const value1 = this.grid.get(x, y);
			const value2 = this.grid.get(x, y + 1);
			if(value1 === null && value2 === null) {
				result.grid.set(x, y, "D");
				result.grid.set(x, y + 1, "U");
			}
			return result;
		}
	}

	firstEmptyPosition() {
		return this.grid.findPosition(v => v === null);
	}
	isComplete() {
		return !this.grid.includes(null);
	}

	getCorners(whichSide) {
		/* returns an array of booleans where each boolean represents whether
		there is a corner of a tile at that height on the left/right side. */
		let corners = [];
		for(let y = 0; y < this.grid.height() - 1; y ++) {
			if(whichSide === "left") {
				const value = this.grid.get(0, y);
				const isCorner = (value === "R" || value === "U");
				corners.push(isCorner);
			}
			else if(whichSide === "right") {
				const value = this.grid.get(this.grid.width() - 1, y);
				const isCorner = (value === "L" || value === "U");
				corners.push(isCorner);
			}
		}
		return corners;
	}

	*validTilingsGenerator() {
		if(!this.isValid()) { return; }
		if(this.isComplete()) {
			yield this;
		}
		else {
			const position = this.firstEmptyPosition();
			for(const orientation of ["horizontal", "vertical"]) {
				if(this.canAddTile(position.x, position.y, orientation)) {
					const nextStep = this.addTile(position.x, position.y, orientation);
					for(const tiling of nextStep.validTilingsGenerator()) {
						yield tiling;
					}
				}
			}
		}
	}
	static validTilings(width, height) {
		if((width * height) % 2 !== 0) { return []; }
		return [...new Tiling(width, height).validTilingsGenerator()];
	}

	static canBeTiled(width, height) {
		/* Returns whether the rectangle can be legally tiled.
		May also return null if it is unknown whether it can be tiled or not. */

		const area = width * height;
		if(area % 2 !== 0) { return false; }
		if(width < height) { [width, height] = [height, width]; }
		/* width >= height -- wide, short rectangles. */
		if(height <= 4) { return true; }
		if(height <= 5 && width % 4 === 0) { return true; }

		if(
			width % height <= Math.floor(width / height) + 1 && height % 2 === 0
		) { return true; }

		return null; // unknown -- use a brute force algorithm to find out
	}
	static canAlwaysBeTiled(height) {
		/* Returns the circumstances under which a rectangle with the given
		height can be legally tiled.

		If all rectangles of that height can be tiled, the algorithm returns true.

		Sometimes rectangles can only be tiled if their width meets a certain
		criteria, such as being divisible by 3, or being 1 above a multiple of 7.
		In those cases, it will return an array containing:
		- The multiplier (3 and 7 in the examples above)
		- The offsets (0 and 1 in the examples above)
		*/

		const segments = [];
		for(let patternWidth = 1; patternWidth <= height; patternWidth ++) {
			const tilings = Tiling.validTilings(patternWidth, height);
			segments.push(...tilings);
		}

		debugger;
	}

	static isTileable(width, height) {
		if(Tiling.canBeTiled(width, height)) { return true; }
		for(const tiling of Tiling.validTilings(width, height)) {
			return true;
		}
		return false;
	}
}

testing.addUnit("Tiling.isValid()", {
	"returns true for valid tilings": () => {
		const tiling = new Tiling(new Grid([
			["R", "L", "D", "D"],
			["R", "L", "U", "U"]
		]));
		expect(tiling.isValid()).toEqual(true);
	},
	"returns false for tilings where four corners meet at a point": () => {
		const tiling = new Tiling(new Grid([
			["R", "L", "D", "D"],
			["R", "L", "U", "U"],
			["D", "D", "R", "L"],
			["U", "U", "R", "L"]
		]));
		expect(tiling.isValid()).toEqual(false);
	},
	"returns false for tilings where three corners meet at a point": () => {
		const tiling = new Tiling(new Grid([
			["R" , "L" , "D" , "D" ],
			["R" , "L" , "U" , "U" ],
			["D" , "D" , null, null],
			["U" , "U" , null, null]
		]));
		expect(tiling.isValid()).toEqual(false);
	}
});

testing.addUnit("Tiling.addTile()", {
	"can place a horizontal tile": () => {
		const tiling = new Tiling(3, 3).addTile(1, 2, "horizontal");
		expect(tiling.grid.rows).toEqual([
			[null, null, null],
			[null, null, null],
			[null, "R" , "L" ]
		]);
	},
	"can place a vertical tile": () => {
		const tiling = new Tiling(3, 3).addTile(1, 0, "vertical");
		expect(tiling.grid.rows).toEqual([
			[null, "D" , null],
			[null, "U" , null],
			[null, null, null]
		]);
	},
	"does not modify original tiling": () => {
		const tiling = new Tiling(3, 3);
		const newTiling = tiling.addTile(1, 2, "horizontal");
		expect(tiling.grid.rows).toEqual([
			[null, null, null],
			[null, null, null],
			[null, null, null]
		]);
		expect(newTiling.grid.rows).toEqual([
			[null, null, null],
			[null, null, null],
			[null, "R" , "L" ]
		]);
	}
});

testing.addUnit("Tiling.getCorners()", {
	"can get the corners on the left side of the tiling": () => {
		const tiling = new Tiling(new Grid([
			["R", "L", "D"],
			["D", "D", "U"],
			["U", "U", "D"],
			["R", "L", "U"]
		]));
		const corners = tiling.getCorners("left");
		expect(corners).toEqual([true, false, true]);
	},
	"can get the corners on the right side of the tiling": () => {
		const tiling = new Tiling(new Grid([
			["R", "L", "D"],
			["D", "D", "U"],
			["U", "U", "D"],
			["R", "L", "U"]
		]));
		const corners = tiling.getCorners("right");
		expect(corners).toEqual([false, true, false]);
	}
});

testing.addUnit("Tiling.validTilings()", {
	"can tile a 1x2 rectangle": () => {
		const tilings = Tiling.validTilings(1, 2);
		expect(tilings).toEqual([new Tiling(new Grid([
			["D"],
			["U"]
		]))]);
	},
	"can tile a 2x2 rectangle": () => {
		const tilings = Tiling.validTilings(2, 2);
		expect(new Set(tilings)).toEqual(new Set([
			new Tiling(new Grid([
				["R", "L"],
				["R", "L"]
			])),
			new Tiling(new Grid([
				["D", "D"],
				["U", "U"]
			]))
		]));
	},
	"can tile a 4x2 rectangle": () => {
		const tilings = Tiling.validTilings(4, 2);
		expect(new Set(tilings)).toEqual(new Set([
			new Tiling(new Grid([
				["D", "R", "L", "D"],
				["U", "R", "L", "U"]
			])),
			new Tiling(new Grid([
				["D", "D", "D", "D"],
				["U", "U", "U", "U"]
			])),
			new Tiling(new Grid([
				["R", "L", "D", "D"],
				["R", "L", "U", "U"]
			])),
			new Tiling(new Grid([
				["D", "D", "R", "L"],
				["U", "U", "R", "L"]
			]))
		]));
	},
	"can tile a 7x10 rectangle, which has no valid tilings": () => {
		// const tilings = Tiling.validTilings(7, 10);
		// expect(tilings).toEqual([]);
	}
});
testing.addUnit("canBeTiled()", [
	(width, height) => Tiling.canBeTiled(width, height),
	[1, 5730, true],
	[2, 3660, true],
	[3, 5264, true],
	[4, 9064, true],
	[5, 4012, true],
	[398, 398, true],
	[100, 1000, true],
	[100, 1001, true],
	[100, 1004, true],
	[100, 1007, true],
	[100, 1010, true],


	// these are all untileable, but the algorithm isn't going to find that out
	[7, 10, null],
	[10, 7, null],
	[20, 66, null],
	[66, 20, null],
	[22, 60, null],
	[60, 22, null],
	[24, 55, null],
	[55, 24, null],
	[30, 44, null],
	[44, 30, null],
	[33, 40, null],
	[40, 33, null],
]);
// testing.addUnit("canAlwaysBeTiled()", [
// 	width => Tiling.canAlwaysBeTiled(width),
//
// 	[1, true],
// 	[2, true],
// 	[3, true],
// 	[4, true],
//
// 	[7, false],
// 	[20, false]
// ]);

const divisorPairs = (number) => {
	const pairs = [];
	for(let i = 1; i * i <= number; i ++) {
		if(number % i === 0) {
			pairs.push([i, number / i]);
		}
	}
	return pairs;
};
const testShortcuts = () => {
	const MIN_AREA = 1000000;
	const MAX_AREA = 1010000;

	const numbers = new Array(MAX_AREA - MIN_AREA + 1).fill().map((v, i) => i + MIN_AREA);
	const rectangles = numbers.map(n => divisorPairs(n)).flat();
	const results = rectangles.map(([width, height]) => Tiling.canBeTiled(width, height));
	const percentKnown = 100 * results.count(v => v !== null) / results.length;
	console.log(`${percentKnown.toFixed(4)}% of rectangles skipped.`);
}
// testShortcuts();

const DESIRED_UNTILEABLES = 200;
const solve = () => {
	for(const area of numbersWithAtLeastNDivisors(DESIRED_UNTILEABLES * 2)) {
		const rectangles = divisorPairs(area);
		let maxUntileables = rectangles.length;
		let untileables = 0;
		for(const [width, height] of rectangles) {
			if(!Tiling.isTileable(width, height)) {
				untileables ++;
			}
			else {
				maxUntileables --;
				if(maxUntileables < DESIRED_UNTILEABLES) {
					break;
				}
			}
		}
		if(untileables === DESIRED_UNTILEABLES) {
			console.log(`the answer is ${area}`);
			return area;
		}
	}
};
