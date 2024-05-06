const isPerfectSquare = (num) => Math.floor(Math.sqrt(num)) ** 2 === num;
const isAdmissible = (x, y) => !(isPerfectSquare(x) && isPerfectSquare(y) && isPerfectSquare(x + y));
const admissiblePaths = ((x, y, modulo = Infinity) => {
	if(x < 0 || y < 0) { return 0n; }
	if(x === 0 || y === 0) { return 1n; }
	if(!isAdmissible(x, y)) { return 0n; }
	let result = admissiblePaths(x - 1, y, modulo) + admissiblePaths(x, y - 1, modulo);
	if(modulo != Infinity) {
		result %= BigInt(modulo);
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
	"returns the correct result for 16 (with a modulo)": () => {
		const result = admissiblePaths(16, 16, 67);
		expect(result).toEqual(52);
	},
	// "returns the correct result for 1000 (with a modulo)": () => {
	// 	const result = admissiblePaths(1000, 1000, 1000000007);
	// 	expect(result).toEqual(341920854);
	// },
});

const solve = () => {
	const result = admissiblePaths(1e7, 1e7, 1e9 + 7);
	console.log(`the answer is ${result}`);
}

const testCases = new Array(100).fill().map((v, i) => i);
const timePolynomial = utils.time.extrapolate(
	({ numbers: [gridSize] }) => admissiblePaths(gridSize, gridSize),
	"a * n^2 + b * n + c",
	["n"],
	testCases,
	10
);
const time = timePolynomial.substitute("n", 10000000).simplify();
