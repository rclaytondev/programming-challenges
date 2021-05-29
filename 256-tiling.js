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
		if(orientation === "horizontal" || orientation === "right") {
			return (
				this.grid.get(x, y) === null &&
				x + 1 < this.grid.width() &&
				this.grid.get(x + 1, y) === null
			);
		}
		else if(orientation === "vertical" || orientation === "down") {
			return (
				this.grid.get(x, y) === null &&
				y + 1 < this.grid.height() &&
				this.grid.get(x, y + 1) === null
			);
		}
		else if(orientation === "left") {
			return this.canAddTile(x - 1, y, "horizontal");
		}
		else if(orientation === "up") {
			return this.canAddTile(x, y - 1, "vertical");
		}
	}
	addTile(x, y, orientation) {
		const result = this.clone();
		if(orientation === "horizontal" || orientation === "right") {
			const value1 = this.grid.get(x, y);
			const value2 = this.grid.get(x + 1, y);
			if(value1 === null && value2 === null) {
				result.grid.set(x, y, "R");
				result.grid.set(x + 1, y, "L");
			}
			return result;
		}
		else if(orientation === "vertical" || orientation === "down") {
			const value1 = this.grid.get(x, y);
			const value2 = this.grid.get(x, y + 1);
			if(value1 === null && value2 === null) {
				result.grid.set(x, y, "D");
				result.grid.set(x, y + 1, "U");
			}
			return result;
		}
		else if(orientation === "left") {
			return this.addTile(x - 1, y, "horizontal");
		}
		else if(orientation === "up") {
			return this.addTile(x, y - 1, "vertical");
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

	static tileabilityCriteria1(shortSide, longSide) {
		return shortSide <= 4 || (shortSide <= 5 && longSide % 4 === 0);
	}
	static tileabilityCriteria2(shortSide, longSide) {
		return shortSide % 2 === 0 && longSide % shortSide <= Math.floor(longSide / shortSide) + 1;
	}
	static tileabilityCriteria3(shortSide, longSide) {
		return shortSide % 2 === 0 && linearLatticePointExists(shortSide - 1, shortSide, longSide);
	}
	static tileabilityCriteria4(shortSide, longSide) {
		return shortSide % 2 === 0 && linearLatticePointExists(shortSide - 1, shortSide, longSide - 1);
	}
	static tileabilityCriteria5(shortSide, longSide) {
		return shortSide % 2 === 0 && linearLatticePointExists(shortSide - 1, shortSide * 2, longSide + 1);
	}
	static tileabilityCriteria6(shortSide, longSide) {
		return shortSide % 2 === 1 && longSide % (shortSide - 1) === 0;
	}


	static canBeTiled(width, height) {
		/* Returns whether the rectangle can be legally tiled. */
		const area = width * height;
		if(area % 2 !== 0) { return false; }

		const shortSide = Math.min(width, height);
		const longSide = Math.max(width, height);
		return (
			Tiling.tileabilityCriteria1(shortSide, longSide) ||
			Tiling.tileabilityCriteria2(shortSide, longSide) ||
			Tiling.tileabilityCriteria3(shortSide, longSide) ||
			Tiling.tileabilityCriteria4(shortSide, longSide) ||
			Tiling.tileabilityCriteria5(shortSide, longSide) ||
			Tiling.tileabilityCriteria6(shortSide, longSide)
		);
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

	rectangles() {
		const rectangles = [];
		this.grid.forEach((value, x, y) => {
			if(value === "R") {
				const rect = new Rectangle({ x, y, w: 2, h: 1 });
				rect.orientation = "horizontal";
				rectangles.push(rect);
			}
			else if(value === "D") {
				const rect = new Rectangle({ x, y, w: 1, h: 2 });
				rect.orientation = "vertical";
				rectangles.push(rect);
			}
		});
		return rectangles;
	}

	rotate(angle = 90) {
		while(angle < 0) { angle += 90; }
		while(angle >= 360) { angle -= 90; }
		const MAPPINGS = {
			"0": { U: "U", D: "D", L: "L", R: "R" },
			"90": { U: "R", D: "L", L: "U", R: "D" },
			"180": { U: "D", D: "U", L: "R", R: "L" },
			"270": { U: "L", D: "R", L: "D", R: "U" }
		};
		return new Tiling(
			this.grid
			.rotate(angle)
			.map(v => MAPPINGS[angle][v] ?? null)
		);
	}
	translate(translation) {
		return new Tiling(this.grid.map((v, x, y) => {
			if(
				x - translation.x <= 0 ||
				x - translation.x >= this.grid.width() ||
				y - translation.y <= 0 ||
				y - translation.y >= this.grid.width()
			) { return null; }
			return this.grid.get(x - translation.x, y - translation.y) ?? null;
		}));
	}

	pad(size) {
		const tiling = new Tiling(this.grid.width() + size * 2, this.grid.height() + size * 2);
		this.grid.forEach((value, x, y) => {
			tiling.grid.set(x + size, y + size, value);
		});
		return tiling;
	}

	static PUZZLE_PIECES = (() => {
		const tilings = [];
		for(const rotation of [0, 90, 180, 270]) {
			const initialTiling = new Tiling(6, 6).addTile(2, 2, "right");
			for(const orientation1 of ["left", "down"]) {
				for(const orientation2 of ["right", "down"]) {
					if(orientation1 === orientation2) { continue; }
					tilings.push(initialTiling
						.addTile(2, 3, orientation1)
						.addTile(3, 3, orientation2)
						.rotate(rotation)
					);
				}
			}
		}
		const pieces = tilings.map((tiling, index) => ({
			id: index,
			connections: { left: [], right: [], up: [], down: [] },
			tiling: tiling
		}));
		const canBeJoined = (tiling1, tiling2, direction) => {
			const vector = DIRECTION_VECTORS[direction];
			const translated = tiling2.translate(vector);
			return tiling1.grid.every((v, x, y) => (
				v === null ||
				translated.grid.get(x, y) === null ||
				v === translated.grid.get(x, y)
			));
		};
		for(const direction of ["left", "right", "up", "down"]) {
			for(const piece1 of pieces) {
				for(const piece2 of pieces) {
					if(canBeJoined(piece1.tiling, piece2.tiling, direction)) {
						piece1.connections[direction].push(piece2.id);
					}
				}
			}
		}
		for(const piece of pieces) {
			if(piece.tiling.grid.rows[1].every(v => v === null)) {
				piece.connections.up.push("edge");
			}
			if(piece.tiling.grid.rows[4].every(v => v === null)) {
				piece.connections.down.push("edge");
			}
			if(piece.tiling.grid.every((v, x) => v === null || x !== 1)) {
				piece.connections.left.push("edge");
			}
			if(piece.tiling.grid.every((v, x) => v === null || x !== 4)) {
				piece.connections.right.push("edge");
			}
		}
		return pieces;
	}) ();
	static JIGSAW_PUZZLE = new JigsawPuzzle(Tiling.PUZZLE_PIECES);
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


	// [7, 10, false],
	// [10, 7, false],
	// [20, 66, false],
	// [66, 20, false],
	// [22, 60, false],
	// [60, 22, false],
	// [24, 55, false],
	// [55, 24, false],
	// [30, 44, false],
	// [44, 30, false],
	// [33, 40, false],
	// [40, 33, false],
]);
testing.addUnit("Tiling.tileabilityCriteria1()", {
	"returns true for rectangles with a side length less than 4": () => {
		expect(Tiling.tileabilityCriteria1(4, 6)).toEqual(true);
	},
	"returns true for rectangles with one side length 5 and other side divisible by 4": () => {
		expect(Tiling.tileabilityCriteria1(5, 400)).toEqual(true);
	},
	"returns false for rectangles with one side length 5 and other side not divisible by 4": () => {
		expect(Tiling.tileabilityCriteria1(5, 401)).toEqual(false);
	},
	"returns false for rectangles with side lengths greater than 5": () => {
		expect(Tiling.tileabilityCriteria1(178, 286)).toEqual(false);
	}
});
testing.addUnit("Tiling.tileabilityCriteria2()", {
	"returns true when one side is divisible by the other": () => {
		expect(Tiling.tileabilityCriteria2(100, 1000)).toEqual(true);
	},
	"returns true when one side is slightly longer than a multiple of the other": () => {
		expect(Tiling.tileabilityCriteria2(100, 1011)).toEqual(true);
	},
	"returns false when the tiling pattern is not applicable": () => {
		expect(Tiling.tileabilityCriteria2(100, 1012)).toEqual(false);
	}
});
testing.addUnit("Tiling.tileabilityCriteria3()", {
	"returns true for rectangles that can be tiled according to the pattern": () => {
		expect(Tiling.tileabilityCriteria3(4, 7)).toEqual(true);
	},
	"returns false for rectangles that cannot be tiled according to the pattern": () => {
		expect(Tiling.tileabilityCriteria3(6, 9)).toEqual(false);
	},
	"returns false for rectangles where the shorter side length is odd": () => {
		expect(Tiling.tileabilityCriteria3(3, 10)).toEqual(false);
	}
});
testing.addUnit("Tiling.tileabilityCriteria4()", {
	"returns true for rectangles that can be tiled according to the pattern": () => {
		expect(Tiling.tileabilityCriteria4(4, 18)).toEqual(true);
	},
	"returns false for rectangles that cannot be tiled according to the pattern": () => {
		expect(Tiling.tileabilityCriteria4(6, 10)).toEqual(false);
	},
	"returns false for rectangles where the shorter side length is odd": () => {
		expect(Tiling.tileabilityCriteria4(7, 13)).toEqual(false);
	}
});
testing.addUnit("Tiling.tileabilityCriteria5()", {
	"returns true for rectangles that can be tiled according to the pattern": () => {
		expect(Tiling.tileabilityCriteria5(4, 399)).toEqual(true);
	},
	"returns false for rectangles that cannot be tiled according to the pattern - test case 1": () => {
		expect(Tiling.tileabilityCriteria5(7, 10)).toEqual(false);
	},
	"returns false for rectangles that cannot be tiled according to the pattern - test case 2": () => {
		expect(Tiling.tileabilityCriteria5(5, 12)).toEqual(false);
	},
	"returns false for rectangles where the shorter side length is odd": () => {
		expect(Tiling.tileabilityCriteria5(3, 10)).toEqual(false);
	}
});
testing.addUnit("Tiling.tileabilityCriteria6()", {
	"returns true for rectangles that can be tiled according to the pattern": () => {
		expect(Tiling.tileabilityCriteria6(9, 800)).toEqual(true);
	},
	"returns false for rectangles that cannot be tiled according to the pattern": () => {
		expect(Tiling.tileabilityCriteria6(9, 801)).toEqual(false);
	},
	"returns false for rectangles where the shorter side length is even": () => {
		expect(Tiling.tileabilityCriteria6(8, 700)).toEqual(false);
	}
});

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
			if(!Tiling.canBeTiled(width, height)) {
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




const linearLatticePoints = (coefficient1, coefficient2, weightedSum) => {
	const yValuesMod1 = [];
	const latticePoints = [];
	const xIntercept = weightedSum / coefficient1;

	for(let x = 0; x < xIntercept; x ++) {
		const y = (weightedSum - coefficient1 * x) / coefficient2;
		if(y === Math.round(y)) {
			latticePoints.push(new Vector(x, y))
		}
		const matches = (v) => Math.dist(v, y % 1) < 1e-12;
		const isLatticePoint = (v) => Math.abs(v % 1) < 1e-12;
		if(yValuesMod1.some(matches)) {
			yValuesMod1.push(y % 1);
			if(!yValuesMod1.some(isLatticePoint)) { return []; }
			const lastLatticePoint = yValuesMod1.findLastIndex(isLatticePoint);
			const period = yValuesMod1.length - yValuesMod1.findIndex(matches) - 1;
			for(let x2 = lastLatticePoint + period; x2 <= xIntercept; x2 += period) {
				latticePoints.push(new Vector(x2, (weightedSum - coefficient1 * x2) / coefficient2));
			}
			return latticePoints;
		}
		else { yValuesMod1.push(y % 1); }
	}
	return latticePoints;
};
const linearLatticePointExists = (coefficient1, coefficient2, weightedSum) => {
	const yValuesMod1 = [];
	const xIntercept = weightedSum / coefficient1;
	for(let x = 0; x <= xIntercept; x ++) {
		const y = (weightedSum - coefficient1 * x) / coefficient2;
		if(y === Math.round(y)) {
			return true;
		}
		if(yValuesMod1.some(v => Math.dist(v, y % 1) < 1e-12)) {
			return false;
		}
		yValuesMod1.push(y % 1);
	}
	return false;
};
testing.addUnit("linearLatticePoints()", {
	"returns the lattice points for the line x + y = 3": () => {
		const latticePoints = linearLatticePoints(1, 1, 3);
		expect(latticePoints).toEqual([
			new Vector(0, 3),
			new Vector(1, 2),
			new Vector(2, 1),
			new Vector(3, 0)
		]);
	},
	"returns the lattice points for the line 2x + 3y = 9": () => {
		const latticePoints = linearLatticePoints(2, 3, 9);
		expect(latticePoints).toEqual([
			new Vector(0, 3),
			new Vector(3, 1)
		]);
	},
	"returns the lattice points for the line 5x + 3y = 14": () => {
		const latticePoints = linearLatticePoints(5, 3, 14);
		expect(latticePoints).toEqual([ new Vector(1, 3) ]);
	},
	"returns the lattice points for x + 6y = 10": () => {
		const latticePoints = linearLatticePoints(1, 6, 10);
		expect(latticePoints).toEqual([
			new Vector(4, 1),
			new Vector(10, 0)
		]);
	},
	"returns the lattice points for the line 5x + 7y = 9": () => {
		const latticePoints = linearLatticePoints(5, 7, 9);
		expect(latticePoints).toEqual([]);
	}
});
testing.addUnit("linearLatticePointExists()", {
	"returns true when the lattice points exist": () => {
		expect(linearLatticePointExists(5, 3, 14)).toEqual(true);
	},
	"returns false when the lattice points do not exist": () => {
		expect(linearLatticePointExists(5, 7, 9)).toEqual(false);
	}
});
