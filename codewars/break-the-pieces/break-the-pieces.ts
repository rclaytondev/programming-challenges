import { describe, it } from "mocha";
import { assert, expect } from "chai";

type Point = { x: number, y: number };
const includesPoint = function(arr: Point[], point: Point): boolean {
	return arr.some(p => p.x === point.x && p.y === point.y);
};

const getChar = function(input: string, x: number, y: number): string {
	return input.split("\n")[y][x];
};
const getAdjacentPositions = function(point: Point, includeDiagonals: boolean): Point[] {
	const orthogonalPositions = [
		{ x: point.x - 1, y: point.y },
		{ x: point.x + 1, y: point.y },
		{ x: point.x, y: point.y - 1 },
		{ x: point.x, y: point.y + 1 },
	];
	if(!includeDiagonals) { return orthogonalPositions; }
	const diagonalPositions = [
		{ x: point.x - 1, y: point.y - 1 },
		{ x: point.x - 1, y: point.y + 1 },
		{ x: point.x + 1, y: point.y - 1 },
		{ x: point.x + 1, y: point.y + 1 },
	];
	return [...orthogonalPositions, ...diagonalPositions];
};
const trimEnd = (str: string) => {
	const matches = /\s+$/.exec(str);
	if(matches != null && matches.length !== 0) {
		const [whitespace] = matches;
		return str.substring(0, str.length - whitespace.length);
	}
	return str;
};


const getPositions = function(input: string, x: number, y: number): Point[] {
	const width = input.split("\n")[0].length;
	const height = input.split("\n").length;
	const positions = [{ x: x, y: y }];
	const unexploredPositions = [...positions];
	while(unexploredPositions.length > 0) {
		const nextPosition = unexploredPositions.shift()!;
		for(const adjacentPosition of getAdjacentPositions(nextPosition, false)) {
			const isInBounds = (
				adjacentPosition.x >= 0 && adjacentPosition.x < width &&
				adjacentPosition.y >= 0 && adjacentPosition.y < height
			);
			if(isInBounds) {
				const alreadyExplored = includesPoint(positions, adjacentPosition);
				const isEmpty = (getChar(input, adjacentPosition.x, adjacentPosition.y) === " ");
				if(!alreadyExplored && isEmpty) {
					positions.push(adjacentPosition);
					unexploredPositions.push(adjacentPosition);
				}
			}
		}
	}
	return positions;
};
const addBorder = function(positions: Point[]): Point[] {
	const result = [...positions];
	for(const position of positions) {
		for(const adjacentPosition of getAdjacentPositions(position, true)) {
			if(!includesPoint(result, adjacentPosition)) {
				result.push(adjacentPosition);
			}
		}
	}
	return result;
};
const alignToOrigin = function(positions: Point[]): Point[] {
	const minX = Math.min(...positions.map(p => p.x));
	const minY = Math.min(...positions.map(p => p.y));
	return positions.map(p => ({ x: p.x - minX, y: p.y - minY }));
};
const getPiece = function(input: string, x: number, y: number): string {
	let interior = getPositions(input, x, y);
	const positions = alignToOrigin(addBorder(interior));
	interior = alignToOrigin(interior).map(({ x, y }) => ({ x: x + 1, y: y + 1 }));
	const border = positions.filter(p => !includesPoint(interior, p));
	const width = Math.max(...positions.map(p => p.x)) + 1;
	const height = Math.max(...positions.map(p => p.y)) + 1;
	const piece = new Array(height).fill([]).map(() => new Array(width).fill(" "));
	for(const point of border) {
		const occupiedHorizontal = (
			includesPoint(border, { x: point.x - 1, y: point.y }) ||
			includesPoint(border, { x : point.x + 1, y: point.y })
		);
		const occupiedVertical = (
			includesPoint(border, { x: point.x, y: point.y - 1 }) ||
			includesPoint(border, { x : point.x, y: point.y + 1 })
		);
		if(occupiedHorizontal && !occupiedVertical) {
			piece[point.y][point.x] = "-";
		}
		else if(occupiedVertical && !occupiedHorizontal) {
			piece[point.y][point.x] = "|";
		}
		else if(occupiedHorizontal && occupiedVertical) {
			piece[point.y][point.x] = "+";
		}
		else {
			throw new Error("Unexpected: found an isolated boundary point within a shape.");
		}
	}
	return piece.map(row => trimEnd(row.join(""))).join("\n");
};

const isAdjacentToBorder = function(positions: Point[], width: number, height: number) {
	return positions.some(({ x, y }) => (
		x <= 0 || x >= width - 1 || y <= 0 || y >= height - 1
	));
};
const breakPieces = function(input: string): string[] {
	const inputAsArray = input.split("\n").map(str => str.split(""));
	const width = inputAsArray[0].length;
	const height = inputAsArray.length;
	const emptySpacesExplored: Point[] = [];
	const result = [];
	for(let y = 0; y < height; y ++) {
		for(let x = 0; x < width; x ++) {
			if(inputAsArray[y][x] === " " && !includesPoint(emptySpacesExplored, { x, y })) {
				const shape = getPositions(input, x, y);
				for(const point of shape) {
					if(!includesPoint(emptySpacesExplored, point)) {
						emptySpacesExplored.push(point);
					}
				}
				if(!isAdjacentToBorder(shape, width, height)) {
					result.push(getPiece(input, x, y));
				}
			}
		}
	}
	return result;
};

describe("getChar", () => {
	it("returns the character at the given position", () => {
		const string = "ab\ncd";
		const char = getChar(string, 1, 0);
		assert.equal(char, "b");
	});
});
describe("getPositions", () => {
	it("returns a list of the positions within the piece (not including the border)", () => {
		const shape = [
			"+------------+",
			"|            |",
			"|            |",
			"|            |",
			"+------+-----+",
			"|      |     |",
			"|      |     |",
			"+------+-----+",
		].join("\n");
		const positions = getPositions(shape, 8, 5);
		expect(positions).to.have.deep.members([
			{ x: 8, y: 5 }, { x: 9, y: 5 }, { x: 10, y: 5 }, { x: 11, y: 5 }, { x: 12, y: 5 },
			{ x: 8, y: 6 }, { x: 9, y: 6 }, { x: 10, y: 6 }, { x: 11, y: 6 }, { x: 12, y: 6 },
		]);
	});
});
describe("addBorder", () => {
	it("returns the positions with a border around them", () => {
		const points = [{ x: 0, y: 0 }, { x: 1, y: 0 }];
		const border = addBorder(points);
		expect(border).to.have.deep.members([
			{ x: -1, y: -1 }, { x: 0, y: -1 }, { x: 1, y: -1 }, { x: 2, y: -1 },
			{ x: -1, y: 0 }, { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 },
			{ x: -1, y: 1 }, { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 },
		]);
	});
});
describe("getPiece", () => {
	it("returns the top rectangle when the input location is within that rectangle", () => {
		const shape = [
			"+------------+",
			"|            |",
			"|            |",
			"|            |",
			"+------+-----+",
			"|      |     |",
			"|      |     |",
			"+------+-----+",
		].join("\n");
		const piece = getPiece(shape, 2, 3);
		assert.equal(piece, [
			"+------------+",
			"|            |",
			"|            |",
			"|            |",
			"+------------+",
		].join("\n"));
	});
});
describe("breakPieces", () => {
	it("works for a shape made of 3 rectangles", () => {
		const input = [
			"+------------+",
			"|            |",
			"|            |",
			"|            |",
			"+------+-----+",
			"|      |     |",
			"|      |     |",
			"+------+-----+",
		].join("\n");
		const expected = [
			[
				"+------------+",
				"|            |",
				"|            |",
				"|            |",
				"+------------+",
			].join("\n"),
			[
				"+------+",
				"|      |",
				"|      |",
				"+------+",
			].join("\n"),
			[
				"+-----+",
				"|     |",
				"|     |",
				"+-----+",
			].join("\n"),
		];
		assert.deepEqual(expected.sort(), breakPieces(input).sort());
	});
	it("works for a shape made of 2 non-rectangular L-shapes", () => {
		const input = [
			"+-------------------+--+",
			"|                   |  |",
			"|                   |  |",
			"|  +----------------+  |",
			"|  |                   |",
			"|  |                   |",
			"+--+-------------------+",
		].join("\n");
		const expected = [
			[
				"                 +--+",
				"                 |  |",
				"                 |  |",
				"+----------------+  |",
				"|                   |",
				"|                   |",
				"+-------------------+",
			].join("\n"),
			[
				"+-------------------+",
				"|                   |",
				"|                   |",
				"|  +----------------+",
				"|  |",
				"|  |",
				"+--+",
			].join("\n"),
		];
		assert.deepEqual(expected.sort(), breakPieces(input).sort());
	});
	it("works for a shape that is not a rectangle", () => {
		const input = [
			"           +-+             ",
			"           | |             ",
			"         +-+-+-+           ",
			"         |     |           ",
			"      +--+-----+--+        ",
			"      |           |        ",
			"   +--+-----------+--+     ",
			"   |                 |     ",
			"   +-----------------+     ",
		].join("\n");
		const expected = [
			[
				"+-+",
				"| |",
				"+-+",
			].join("\n"),
			[
				"+-----+",
				"|     |",
				"+-----+",
			].join("\n"),
			[
				"+-----------+",
				"|           |",
				"+-----------+",
			].join("\n"),
			[
				"+-----------------+",
				"|                 |",
				"+-----------------+",
			].join("\n"),
		];
		assert.deepEqual(expected.sort(), breakPieces(input).sort());
	});
});
