/*
This algorithm generates the inadmissible points using a brute-force search of the lists of three perfect squares.
Then it finds the number of admissible paths by taking the whole number of paths (w choose h) and subtracting illegal paths.
*/

const isPerfectSquare = (num) => Math.floor(Math.sqrt(num)) ** 2 === num;
const pythagoreanTriples = (maxX, maxY) => {
	/* returns all vectors (x, y) such that x <= maxX and y <= maxY and x^2 + y^2 is a perfect square. */
	const triples = [];
	for(let x = 1; x <= maxX; x ++) {
		for(let y = 1; y <= maxY; y ++) {
			if(isPerfectSquare(x ** 2 + y ** 2)) {
				triples.push(new Vector(x, y));
			}
		}
	}
	return triples;
};
const inadmissiblePoints = (width, height) => {
	return (
		pythagoreanTriples(Math.floor(Math.sqrt(width)), Math.floor(Math.sqrt(height)))
		.map(({ x, y }) => new Vector(x ** 2, y ** 2))
	);
};
const admissiblePaths = ((width, height, modulo = Infinity, inadmissibles = inadmissiblePoints(width, height)) => {
	width = BigInt(width);
	height = BigInt(height);
	if(modulo != Infinity) { modulo = BigInt(modulo); }
	inadmissibles = inadmissibles.filter(p => p.x != width || p.y != height);
	const totalPaths = Math.combination(width + height, width);
	let result = (modulo == Infinity) ? totalPaths : totalPaths % modulo;
	for(const inadmissible of inadmissibles) {
		const inadmissiblePaths = (
			Math.combination(
				(width - BigInt(inadmissible.x)) + (height - BigInt(inadmissible.y)),
				height - BigInt(inadmissible.y)
			) * admissiblePaths(
				inadmissible.x, inadmissible.y,
				modulo,
				inadmissibles.filter(point => point.x <= inadmissible.x && point.y <= inadmissible.y)
			)
		);
		result -= inadmissiblePaths;
		if(modulo !== Infinity) {
			result = Math.modulateIntoRange(result, 0n, modulo);
		}
	}
	return result;
}).memoize(true);
testing.addUnit("admissiblePaths()", {
	/* test cases from Project Euler */
	"returns the correct result for 5": () => {
		const result = admissiblePaths(5, 5);
		expect(result).toEqual(252);
	},
	"returns the correct result for 16": () => {
		const result = admissiblePaths(16, 16);
		expect(result).toEqual(596994440);
	},
	"returns the correct result for 1000": () => {
		const result = admissiblePaths(1000, 1000, 1000000007);
		expect(result).toEqual(341920854);
	},

	/* other test cases */
	"returns the correct result for 16 with a modulo of 1000": () => {
		const result = admissiblePaths(16, 16, 1000);
		expect(result).toEqual(440);
	},
	"returns the correct result for 70": () => {
		const result = admissiblePaths(70, 70);
		expect(result).toEqual(83620723681890413171480878065361252665600n);
	}
});

const solve = () => {
	const answer = admissiblePaths(10000000, 10000000,  1000000007);
	console.log(`the answer is ${answer}`);
	return answer;
};


const testCases = new Array(50).fill().map((v, i) => 20 * i + 500);
const timePolynomial = utils.time.extrapolate(
	({ numbers: [gridSize] }) => admissiblePaths(gridSize, gridSize),
	"a * n^2 + b * n + c",
	["n"],
	testCases,
	30
);
const time = timePolynomial.substitute("n", 10000000).simplify();
console.log(utils.time.format(time));
