/*
This algorithm generates the inadmissible points using a brute-force search of the lists of three perfect squares.
Then it finds the number of admissible paths by taking the whole number of paths (w choose h) and subtracting illegal paths.
*/

const pythagoreanTriples = (maxX, maxY) => {
	/* returns all numbers (x, y) such that x < maxX and y < maxY and x^2 + y^2 is a perfect square. */
	// TODO: write the method
};
const inadmissiblePoints = (width, height) => {
	return (
		pythagoreanTriples(Math.floor(Math.sqrt(width)), Math.floor(Math.sqrt(height)))
		.map(({ numbers: [a, b, c] }) => new NVector(a ** 2, b ** 2, c ** 2)
	);
};
const pathsWithPoints = (width, height, requiredPoints) => {

};
const admissiblePaths = (gridSize, modulo = Infinity) => {
	const inadmissibles = inadmissiblePoints(gridSize, gridSize);

};
testing.addUnit("admissiblePaths()", {
	/* test cases from Project Euler */
	"returns the correct result for 5": () => {
		const result = admissiblePaths(5);
		expect(result).toEqual(252);
	},
	"returns the correct result for 16": () => {
		const result = admissiblePaths(16);
		expect(result).toEqual(596994440);
	},
	"returns the correct result for 1000": () => {
		const result = admissiblePaths(1000, 1000000007);
		expect(result).toEqual(341920854);
	},
});
