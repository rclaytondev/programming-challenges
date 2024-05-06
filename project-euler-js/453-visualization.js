const drawGrid = (c, x, y, width, height, gridWidth, gridHeight) => {
	const cellWidth = width / gridWidth;
	const cellHeight = height / gridHeight;
	for(let lineX = x; lineX <= x + width; lineX += cellWidth) {
		c.strokeLine(lineX, y, lineX, y + height);
	}
	for(let lineY = y; lineY <= y + height; lineY += cellHeight) {
		c.strokeLine(x, lineY, x + width, lineY);
	}
};
const gridRectangles = function*(cellSize, marginSize, offset = new Vector(), maxX = canvas.width) {
	let x = offset.x + marginSize.x;
	let y = offset.y + marginSize.y;
	while(true) {
		yield new Rectangle({ x: x, y: y, w: cellSize.x, h: cellSize.y });
		x += cellSize.x + marginSize.x;
		if(x + cellSize.x + marginSize.x > maxX) {
			x = offset.x + marginSize.x
			y += cellSize.y + marginSize.y;
		}
	}
};

const isQuadrilateral = (vertices) => {
	/* returns whether the set of vectors forms a valid quadrilateral. */
	if(vertices.size !== 4) { return false; }
	if(vertices.some(v => v.x !== Math.round(v.x) || v.y !== Math.round(v.y))) {
		return false;
	}
	if([...vertices].map(v => `${v}`).containsDuplicates()) {
		return false;
	}
	for(const vertex of vertices) {
		const others = vertices.filter(v => v !== vertex);
		const [a, b, c] = [...others];
		if(a.x === b.x && b.x === c.x) { return false; }
		const slope1 = (b.y - a.y) / (b.x - a.x);
		const slope2 = (c.y - b.y) / (c.x - b.x);
		if(slope1 === slope2) { return false; }
	}
	return true;
};
const orderVertices = (vertices) => {
	/*
	Takes in a set of vertices (Vector objects) and outputs an array containing
	the same objects but in an order such that the polygon does not
	self-intersect.
	*/
	const centroid = new Vector(
		[...vertices].mean(v => v.x),
		[...vertices].mean(v => v.y)
	);
	return [...vertices].sort((v1, v2) => centroid.angleTo(v1) - centroid.angleTo(v2));
};

const visualize = (rectWidth, rectHeight) => {
	const latticeWidth = rectWidth + 1;
	const latticeHeight = rectHeight + 1;

	const positions = new Set([]);
	for(let x = 0; x < latticeWidth; x ++) {
		for(let y = 0; y < latticeHeight; y ++) {
			positions.add(new Vector(x, y));
		}
	}

	const setsOf4 = positions.subsets().filter(s => s.size === 4);
	const quadrilaterals = [...setsOf4];
	const SQUARE_SIZE = 20;
	const DOT_SIZE = 5;
	const grid = gridRectangles(
		new Vector(rectWidth * SQUARE_SIZE, rectHeight * SQUARE_SIZE),
		new Vector(SQUARE_SIZE, SQUARE_SIZE)
	);
	let index = 0;
	let numValid = 0;
	let numInvalid = 0;
	for(const gridCell of grid) {
		const quadrilateral = quadrilaterals[index];
		const isValid = isQuadrilateral(quadrilateral);
		if(isValid) { numValid ++; }
		else { numInvalid ++; /* index ++; continue; */ }
		index ++;
		if(index >= quadrilaterals.length) { break; }

		if(
			quadrilateral.some(vertex => vertex.equals(1, 2)) &&
			quadrilateral.some(vertex => vertex.equals(0, 0)) &&
			quadrilateral.some(vertex => vertex.equals(1, 1)) &&
			quadrilateral.some(vertex => vertex.equals(2, 0))
		) { debugger; }

		c.fillStyle = "gray";
		c.font = "bold 10px monospace";
		c.textAlign = "center";
		c.textBaseline = "middle";
		c.fillText(isValid ? numValid : numInvalid, gridCell.x - 5, gridCell.y - 5);


		c.strokeStyle = "lightgray";
		c.lineWidth = 1;
		drawGrid(c, gridCell.x, gridCell.y, gridCell.w, gridCell.h, rectWidth, rectHeight);

		c.lineWidth = 3;
		if(isValid) {
			c.strokeStyle = "blue";
			c.fillStyle = "blue";
		}
		else {
			c.lineWidth = 1;
			c.strokeStyle = "red";
			c.fillStyle = "red";
		}
		const sortedVertices = orderVertices(quadrilateral);
		sortedVertices.forEach((vertex, index) => {
			c.fillCircle(
				gridCell.x + vertex.x * SQUARE_SIZE,
				gridCell.y + vertex.y * SQUARE_SIZE,
				isValid ? DOT_SIZE : DOT_SIZE / 2.5
			);
			const nextVertex = sortedVertices[(index + 1) % sortedVertices.length];
			c.strokeLine(
				gridCell.x + vertex.x * SQUARE_SIZE,
				gridCell.y + vertex.y * SQUARE_SIZE,
				gridCell.x + nextVertex.x * SQUARE_SIZE,
				gridCell.y + nextVertex.y * SQUARE_SIZE,
			);
		});
	}
}
visualize(2, 2);
