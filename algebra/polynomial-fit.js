const fitPolynomial = (degree, points) => {
	/* returns an AlgebraTerm2 representing a polynomial that fits the points using a least-squares regression. */
	const terms = [];
	for(let exponent = 0; exponent <= degree; exponent ++) {
		terms.push(new AlgebraTerm2(
			"*", `c${exponent}`, new AlgebraTerm2("^", "x", exponent)
		));
	}
	const polynomial = AlgebraTerm2.sum(...terms);
	const distances = points.map(({ x, y }) => {
		// return new AlgebraTerm2("-", polynomial, )
	});
	// debugger;
};

testing.addUnit("fitPolynomial()", {
	"can perfectly fit a line to two points": () => {
		const line = fitPolynomial(
			1,
			[new Vector(2, 5), new Vector(4, 9)]
		);
		expect(line.toString()).toEqual("(2 * x) + 1");
	},
	"can perfectly fit a parabola to three points": () => {
		const polynomial = fitPolynomial(
			2,
			[new Vector(-6, 10), new Vector(3, 28), new Vector(5, 54)]
		); // x^2 + 5x + 4
		expect(polynomial.toString()).toEqual("((x ^ 2) + (5 * x)) + 4")
	}
});
testing.testAll();