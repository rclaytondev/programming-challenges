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
		equations.push(new Equation(derivative, 0)); // set the derivative to 0 and then solve
	}
	const linearEquations = equations.map(e => new LinearEquation(e).standardForm());
	const systemOfEquations = new LinearEquationSystem(linearEquations);
	const solutions = systemOfEquations.solve();
	let result = polynomial.clone();
	for(const [variable, value] of Object.entries(solutions)) {
		result = result.substitute(variable, value);
	}
	/* round to nearest 10^-12 place */
	for(const subExpression of result.subExpressions()) {
		const { term1, term2 } = subExpression;
		if(typeof term1 === "number") {
			subExpression.term1 = Math.round(subExpression.term1 * 1e12) / 1e12;
		}
		if(typeof term2 === "number") {
			subExpression.term2 = Math.round(subExpression.term2 * 1e12) / 1e12;
		}
	}
	return result.simplify();
};

testing.addUnit("fitPolynomial()", {
	"can perfectly fit a line to two points": () => {
		const line = fitPolynomial(
			1,
			[new Vector(2, 5), new Vector(4, 9)]
		);
		expect(line.toString()).toEqual("1 + (2 * x)");
	},
	"can perfectly fit a parabola to three points": () => {
		const points = [new Vector(-6, 10), new Vector(3, 28), new Vector(5, 54)];
		const polynomial = fitPolynomial(2, points); // x^2 + 5x + 4
		expect(polynomial.toString()).toEqual("(4 + (5 * x)) + (x ^ 2)");
	}
});
