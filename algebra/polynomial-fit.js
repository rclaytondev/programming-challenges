const fitPolynomial = (degree, points) => {
	/* returns an Expression representing a polynomial that fits the points using a least-squares regression. */
	const terms = [];
	for(let exponent = 0; exponent <= degree; exponent ++) {
		terms.push(new Expression(
			"*", `c${exponent}`, new Expression("^", "x", exponent)
		));
	}
	const polynomial = Expression.sum(...terms).simplify();
	const distances = points.map(({ x, y }) => (
		new Expression("-", polynomial.substitute("x", x), y).simplify()
	));
	const distancesSquared = distances.map(d => new Expression("^", d, 2));
	const sumOfDistSq = Expression.sum(...distancesSquared).simplify();
	let equations = [];
	for(let exponent = 0; exponent <= degree; exponent ++) {
		const variable = `c${exponent}`;
		const derivative = sumOfDistSq.differentiate(variable).simplify();
		debugger;
		equations.push(new Equation(derivative, 0)); // set the derivative to 0 and then solve
	}
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
// testing.testUnit("fitPolynomial()");
