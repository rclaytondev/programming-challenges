const factorial = ((number) => {
	if(number <= 1) { return 1; }
	return factorial(number - 1) * number;
}).memoize(true);
const combination = (numObjects, objectsToChoose) => {
	if(objectsToChoose > numObjects) { return 0; }
	return factorial(numObjects) / (factorial(objectsToChoose) * factorial(numObjects - objectsToChoose));
};

const linesInRectangle = function*(rectWidth, rectHeight) {
	/*
	Yields each non-vertical line that has at least two lattice points in the rectangle.
	Each value yielded will be an array containing the following 3 items:
	- A lattice point on the line and in the rectangle
	- The slope of the line
	- The number of lattice points on the line.
	*/
	const linesChecked = new Grid(rectWidth + 1, rectHeight + 1).map(v => new Set());
	const slopes = new Set();
	for(let x = 1; x <= rectWidth; x ++) {
		for(let y = 0; y <= rectHeight; y ++) {
			slopes.add(y / x);
			slopes.add(-y / x);
		}
	}

	const getY = (pointX, pointY, slope, x) => pointY + slope * (x - pointX);
	const latticeWidth = rectWidth + 1, latticeHeight = rectHeight + 1;
	for(let x = 0; x <= rectWidth; x ++) {
		for(let y = 0; y <= rectHeight; y ++) {
			const slopesToSkip = linesChecked.get(x, y);
			for(const slope of slopes.difference(slopesToSkip)) {
				if(x === 2 && y === 1 && slope === -1) { debugger; }
				let latticePoints = 0;
				for(let x2 = 0; x2 < latticeWidth; x2 ++) {
					const y2 = getY(x, y, slope, x2);
					if(y2 === Math.round(y2) && y2 >= 0 && y2 < latticeHeight) {
						latticePoints ++;
						linesChecked.get(x2, y2).add(slope);
					}
				}
				if(latticePoints >= 2) {
					yield [new Vector(x, y), slope, latticePoints];
				}
			}
		}
	}
};

const numQuadrilaterals = (rectWidth, rectHeight) => {
	const latticeWidth = rectWidth + 1;
	const latticeHeight = rectHeight + 1;
	const area = latticeWidth * latticeHeight;

	let illegalWays = 0;
	illegalWays += latticeWidth * combination(latticeHeight, 4);
	illegalWays += latticeWidth * combination(latticeHeight, 3) * (area - latticeHeight);
	for(const [point, slope, latticePoints] of linesInRectangle(rectWidth, rectHeight)) {
		illegalWays += combination(latticePoints, 4);
		illegalWays += combination(latticePoints, 3) * (area - latticePoints);
	}
	return combination(area, 4) - illegalWays;
};
testing.addUnit("numQuadrilaterals()", numQuadrilaterals, [
	[1, 1, 1],
	[2, 2, 94],
	[3, 7, 39590],
	[12, 3, 309000],
	[123, 45, 70542215894646]
]);
