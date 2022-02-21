const minComplexitySum = function(gridSize) {
	let calculated = {}; // can't use a Set due to maximum size restrictions
	let sum = 0;

	/* find which grids have complexity 1 */
	calculated[0] = true;
	calculated[gridSize ** 2] = true;
	sum += 2;

	/* find which grids have complexity 2 */
	for(let x = 0; x <= gridSize; x ++) {
		for(const k of [
			x ** 2 + (gridSize - x) ** 2,
			2 * x * (gridSize - x),
			x * (gridSize - x) + x * gridSize,
			x ** 2
		]) {
			if(!calculated[k]) {
				calculated[k] = true;
				sum += 2;
			}
		}
	}

	/* find which grids have complexity 3 */
	for(let x = 0; x <= gridSize; x ++) {
		for(let y = 0; y <= gridSize; y ++) {
			const k = x * y;
			if(!calculated[k]) {
				calculated[k] = true;
				sum += 3;
			}
			if(!calculated[gridSize ** 2 - k]) {
				calculated[gridSize ** 2 - k] = true;
				sum += 3;
			}
		}
	}
	for(let a = 0; a <= gridSize; a ++) {
		for(let b = 0; a + b <= gridSize; b ++) {
			const c = gridSize - a - b;
			for(const k of [
				2 * a * b,
				a ** 2 + b ** 2,
				a ** 2 + 2 * a * b,
				a ** 2 + 2 * b * c,
				a ** 2 + b ** 2 + c ** 2,
				2 * a * b + b ** 2 + c ** 2,
				a * b + a * c + b * c
			]) {
				if(!calculated[k]) {
					calculated[k] = true;
					sum += 3;
				}
				if(!calculated[gridSize ** 2 - k]) {
					calculated[gridSize ** 2 - k] = true;
					sum += 3;
				}
			}
		}
	}

	/* find which grids have complexity 4 */
	sum += 4 * (gridSize ** 2 + 1 - Object.keys(calculated).length);

	return sum;
};
testing.addUnit(minComplexitySum, [
	[2, 8],
	[5, 64],
	[10, 274],
	[20, 1150]
]);
