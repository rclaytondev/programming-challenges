class JigsawPuzzle {
	constructor(pieces) {
		/*
		A jigsaw puzzle is represented as an array of pieces in the following
		format:
		{
			id: "<insert piece ID here>", // a unique identifier for each piece
			connections: {
				left: ["piece ID 1", "piece ID 2", "..."],
				right: ["piece ID 1", "piece ID 2", "..."],
				up: ["piece ID 1", "piece ID 2", "..."],
				down: ["piece ID 1", "piece ID 2", "..."],
			}
		}
		In the left/right/up/down connections array, a piece can also have the
		string "edge" to represent that the piece can touch the edge of the
		jigsaw puzzle in that direction.

		When solving the jigsaw puzzle, any number of each type of piece can be
		used.
		Rotating pieces is not allowed when solving the puzzle.
		A valid solution to the puzzle need not use all pieces.
		*/
		this.pieces = pieces;
		for(const piece of this.pieces) {
			piece.connections ??= {};
			piece.connections.left ??= [];
			piece.connections.right ??= [];
			piece.connections.up ??= [];
			piece.connections.down ??= [];
		}
	}

	isSolvable(width, height) {
		const pieces = new Map(this.pieces.map(p => [p.id, p]));
		const piecesGraph = new DirectedGraph(this.pieces.map(piece => piece.id));
		for(const piece of this.pieces) {
			for(const nextPiece of piece.connections.right) {
				if(nextPiece !== "edge") {
					piecesGraph.connect(piece.id, nextPiece);
				}
			}
		}
		const rows = piecesGraph.paths(
			this.pieces.filter(p => p.connections.left.includes("edge")).map(p => p.id),
			this.pieces.filter(p => p.connections.right.includes("edge")).map(p => p.id),
			width - 1
		);
		const rowsGraph = new DirectedGraph(rows);
		rowsGraph.setConnections((row1, row2) => {
			for(const [i, pieceID1] of row1.entries()) {
				const pieceID2 = row2[i];
				if(!this.pieces.find(p => p.id === pieceID1).connections.down.includes(pieceID2)) {
					return false;
				}
			}
			return true;
		});
		return rowsGraph.pathExists(
			rows.filter(r => r.every(p => pieces.get(p).connections.up.includes("edge"))),
			rows.filter(r => r.every(p => pieces.get(p).connections.down.includes("edge"))),
			height - 1
		);
	}
}

(() => {
	const TEST_PIECES_1 = [
		{
			id: "A",
			connections: {
				left: ["edge"],
				right: ["B"],
				up: ["edge"],
				down: ["C"]
			}
		},
		{
			id: "B",
			connections: {
				left: ["A"],
				right: ["edge"],
				up: ["edge"],
				down: ["D"],
			}
		},
		{
			id: "C",
			connections: {
				left: ["edge"],
				right: ["D"],
				up: ["A"],
				down: ["edge"]
			}
		},
		{
			id: "D",
			connections: {
				left: ["C"],
				right: ["edge"],
				up: ["B"],
				down: ["edge"]
			}
		}
	];
	// const TEST_PIECES_2 = [
	// 	{
	// 		id: "A",
	// 		connections: {
	// 			left: ["edge", "B"],
	// 			right: ["B"],
	// 			top: [""]
	// 		}
	// 	}
	// ];

	testing.addUnit("JigsawPuzzle.isSolvable()", {
		"returns true for solvable jigsaw puzzles": () => {
			const jigsaw = new JigsawPuzzle(TEST_PIECES_1);
			expect(jigsaw.isSolvable(2, 2)).toEqual(true);
		},
		"returns false for unsolvable jigsaw puzzles": () => {
			const jigsaw = new JigsawPuzzle(TEST_PIECES_1);
			expect(jigsaw.isSolvable(3, 4)).toEqual(false);
		}
	});
}) ();
