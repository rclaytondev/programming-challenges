const generateSpiral = (size) => {
	const grid = new Array(size).fill().map(v => new Array(size).fill(0));
	const setInGrid = (x, y, value) => grid[y][x] = value;

	if(size % 2 === 0) { throw new Error("Spiral sizes must be odd numbers."); }
	const DIRECTIONS = ["right", "down", "left", "up"];
	let direction = DIRECTIONS[0];
	let position = new Vector((size - 1) / 2, (size - 1) / 2);
	const nextDirection = () => {
		direction = DIRECTIONS[(DIRECTIONS.indexOf(direction) + 1) % DIRECTIONS.length];
	};
	let stepSize = 1;
	let number = 1;
	setInGrid(position.x, position.y, 1);
	while(!position.equals(new Vector(size - 1, 0))) {
		for(let i = 0; i < stepSize; i ++) {
			number ++;
			position = position.translate(DIRECTION_VECTORS[direction]);
			setInGrid(position.x, position.y, number);
		}
		nextDirection();
		for(let i = 0; i < stepSize; i ++) {
			number ++;
			position = position.translate(DIRECTION_VECTORS[direction]);
			setInGrid(position.x, position.y, number);
		}
		nextDirection();
		if(position.equals(0, 0)) {
			for(let i = 0; i < stepSize; i ++) {
				number ++;
				position = position.translate(DIRECTION_VECTORS[direction]);
				setInGrid(position.x, position.y, number);
			}
			break;
		}
		stepSize ++;
	}
	return grid;
};

testing.addUnit("generateSpiral()", {
	"test case 1": () => {
		const result = generateSpiral(3);
		expect(result).toEqual([
			[7, 8, 9],
			[6, 1, 2],
			[5, 4, 3]
		]);
	}
});
testing.testUnit("generateSpiral()");


const diagonalSum = (grid) => {
	const width = grid[0].length, height = grid.length;
	expect(width).toEqual(height);

	let sum = 0;
	for(let x = 0; x < width; x ++) {
		const y1 = x;
		const y2 = height - x - 1;
		sum += grid[y1][x];
		if(y1 !== y2) {
			sum += grid[y2][x];
		}
	}
	return sum;
};
testing.addUnit("diagonalSum()", {
	"test case 1": () => {
		const result = diagonalSum([
			[1, 2, 3],
			[4, 5, 6],
			[7, 8, 9]
		]);
		expect(result).toEqual(1 + 5 + 9 + 3 + 7);
	}
});
testing.testUnit("diagonalSum()");


console.log(diagonalSum(generateSpiral(1001)));
