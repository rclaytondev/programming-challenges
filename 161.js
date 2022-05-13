class Triomino {
	constructor(name, grid) {
		this.grid = grid instanceof Grid ? grid : new Grid(grid);
		this.name = name;
	}
}
class Tiling {
	static TRIOMINOES = [
		new Triomino("L-bottom-right", [
			[1, 1],
			[1, 0]
		]),
		new Triomino("L-bottom-left", [
			[1, 1],
			[0, 1]
		]),
		new Triomino("L-top-right", [
			[1, 0],
			[1, 1]
		]),
		new Triomino("L-top-left", [
			[0, 1],
			[1, 1]
		]),
		new Triomino("vertical", [
			[1],
			[1],
			[1]
		]),
		new Triomino("horizontal", [
			[1, 1, 1]
		])
	];
	static getTriomino(name) {
		return Tiling.TRIOMINOES.find(t => t.name === name);
	}

	constructor() {
		if(arguments[0] instanceof Grid) {
			const [grid] = arguments;
			this.grid = grid;
		}
		else if(typeof arguments[0] === "number" && typeof arguments[1] === "number") {
			const [width, height] = arguments;
			this.grid = new Grid(width, height, 0);
		}
		else if(Array.isArray(arguments[0])) {
			const [array2D] = arguments;
			this.grid = new Grid(array2D);
		}
		else {
			throw new Error("Invalid usage.");
		}
	}

	add(triomino, position) {
		/*
		Returns a new grid, with the triomino added at the given position.
		Triominoes will be added so that the top-left corner of the triomino grid goes to `position`, unless the triomino is the top-left L-triomino, in which case
		*/
		const clone = this.clone();
		const newPieceID = [].concat(...this.grid.rows).max() + 1;
		for(const [value, { x, y }] of triomino.grid.entries()) {
			if(value !== 0) {
				const gridPosition = position.add(x, y);
				if(triomino.name === "L-top-left") { gridPosition.x -= 1; }
				clone.grid.set(gridPosition.x, gridPosition.y, newPieceID);
			}
		}
		return clone;
	}
	canAdd(triomino, position) {
		for(const [value, { x, y }] of triomino.grid.entries()) {
			const gridPosition = position.add(x, y);
			if(triomino.name === "L-top-left") { gridPosition.x --; }
			if(value !== 0 && (
				gridPosition.x < 0 || gridPosition.y < 0 || gridPosition.x >= this.grid.width() || gridPosition.y >= this.grid.height() ||
				this.grid.get(gridPosition) !== 0
			)) { return false; }
		}
		return true;
	}
	children() {
		const children = [];
		const nextSpace = this.nextSpace();
		if(nextSpace == null) { return []; }
		for(const triomino of Tiling.TRIOMINOES) {
			if(this.canAdd(triomino, nextSpace)) {
				children.push(this.add(triomino, nextSpace));
			}
		}
		return children;
	}
	nextSpace() {
		return this.grid.findPosition((value) => value === 0);
	}

	isComplete() {
		return this.grid.every(v => v !== 0);
	}

	static numTilings(width, height) {
		let result = 0;
		const emptyTiling = new Tiling(width, height);
		for(const tiling of Tree.iterate(emptyTiling, t => t.children())) {
			if(tiling.isComplete()) { result ++; }
		}
		return result;
	}
}


testing.addUnit("Tiling.add()", {
	"can add a piece to the tiling": () => {
		const tiling = new Tiling(3, 3);
		const newTiling = tiling.add(Tiling.getTriomino("L-top-right"), new Vector(0, 0));
		expect(newTiling.grid).toEqual(new Grid([
			[1, 0, 0],
			[1, 1, 0],
			[0, 0, 0]
		]));
	},
	"can add a piece to the tiling when there are already pieces": () => {
		const tiling = new Tiling(new Grid([
			[1, 0, 0],
			[1, 1, 0],
			[2, 2, 2]
		]));
		const newTiling = tiling.add(Tiling.getTriomino("L-bottom-left"), new Vector(1, 0));
		expect(newTiling.grid).toEqual(new Grid([
			[1, 3, 3],
			[1, 1, 3],
			[2, 2, 2]
		]));
	},
	"can add a top-left-L-shape piece to the tiling (special case)": () => {
		const tiling = new Tiling(3, 3);
		const newTiling = tiling.add(Tiling.getTriomino("L-top-left"), new Vector(1, 0));
		expect(newTiling.grid).toEqual(new Grid([
			[0, 1, 0],
			[1, 1, 0],
			[0, 0, 0]
		]));
	}
});
testing.addUnit("Tiling.children()", {
	"correctly returns the children of the partial tiling": () => {
		const tiling = new Tiling(3, 3);
		const children = tiling.children();
		expect(children).toEqual([
			new Tiling([
				[1, 1, 0],
				[1, 0, 0],
				[0, 0, 0]
			]),
			new Tiling([
				[1, 1, 0],
				[0, 1, 0],
				[0, 0, 0]
			]),
			new Tiling([
				[1, 0, 0],
				[1, 1, 0],
				[0, 0, 0]
			]),
			new Tiling([
				[1, 0, 0],
				[1, 0, 0],
				[1, 0, 0]
			]),
			new Tiling([
				[1, 1, 1],
				[0, 0, 0],
				[0, 0, 0]
			]),
		]);
	}
});
testing.addUnit("Tiling.numTilings()", Tiling.numTilings, [
	[2, 9, 41],
	[9, 2, 41]
]);
