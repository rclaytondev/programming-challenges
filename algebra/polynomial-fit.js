const ALPHABET = "abcdefghijklmnopqrstuvwxyz";
const solveSystem = (...equations) => {
	/* attempts to solve the system of equations using a multivariable generalization of Newton's method. */
	const variables = [...equations.map(eq => eq.variables()).reduce((a, b) => a.union(b))];
	const expressions = equations.map(equation => (
		new Expression("-", equation.leftSide, equation.rightSide).simplify()
	));
	const errors = expressions.map(exp => new Expression("^", exp, 2));
	const sumOfErrors = Expression.sum(...errors).simplify();
	const derivatives = variables.map((v) => sumOfErrors.differentiate(v).simplify());
	let guess = new NVector(...new Array(variables.length).fill(0));
	const NUM_ITERATIONS = 30;
	for(let i = 0; i < NUM_ITERATIONS; i ++) {
		if(sumOfErrors.substitute(variables, guess.numbers).simplify() <= 1e-10) {
			break;
		}
		let newGuessNumbers = [];
		for(const [j, variable] of variables.entries()) {
			let derivative = derivatives[j];
			derivative = derivative.substitute(variables, guess.numbers);
			const slope = derivative.simplify();
			if(slope === 0) { slope = 0.0001; }
			newGuessNumbers[j] = guess.numbers[j] - (sumOfErrors.substitute(variables, guess.numbers).simplify() / slope);
		}
		const combinations = Set.cartesianProduct(
			...new Array(variables.length)
			.fill()
			.map((v, i) => new Set([newGuessNumbers[i], guess.numbers[i]]))
			.filter(combination => !combination.equals(guess.numbers))
		);
		guess = new NVector([...combinations].min((combination) =>
			sumOfErrors.substitute(variables, combination).simplify()
		));
	}
	const result = {};
	for(const [i, number] of guess.numbers.entries()) {
		result[variables[i]] = number;
	}
	return result;
};
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
const fitPolynomialMV = (degree, numVariables, points) => {
	/* fits a multivariable polynomial to the set of points. */
	const exponentCombinations = new Set(new Array(degree + 1).fill().map((v, i) => i)).cartesianPower(numVariables);
	const terms = [];
	let iterations = 0;
	for(const combination of exponentCombinations) {
		const term = Expression.product(
			`c${iterations}`,
			...combination.map((e, i) => new Expression("^", ALPHABET[i], e))
		).simplify();
		terms.push(term);
		iterations ++;
	}
	const polynomial = Expression.sum(...terms);
	const distancesSquared = points.map(({ numbers }) => {
		let distance = polynomial.clone();
		for(const [i, number] of numbers.slice(0, numbers.length - 1).entries()) {
			distance = distance.substitute(ALPHABET[i], number);
		}
		return new Expression(
			"^",
			new Expression("-", distance, numbers[numbers.length - 1]).simplify(),
			2
		);
	});
	const sumOfDistSq = Expression.sum(...distancesSquared);
	const equations = [];
	for(let i = 0; i < (degree + 1) ** numVariables; i ++) {
		const variable = `c${i}`;
		const derivative = sumOfDistSq.differentiate(variable).simplify();
		equations.push(new Equation(derivative, 0));
	}
	const linearEquations = equations.map(e => new LinearEquation(e));
	const systemOfEquations = new LinearEquationSystem(linearEquations);
	const solutions = systemOfEquations.solve();
	let result = polynomial.clone();
	for(const [variable, value] of Object.entries(solutions)) {
		result = result.substitute(variable, value);
	}
	/* round to nearest 10^-9 place */
	for(const subExpression of result.subExpressions()) {
		const { term1, term2 } = subExpression;
		if(typeof term1 === "number") {
			subExpression.term1 = Math.round(subExpression.term1 * 1e9) / 1e9;
		}
		if(typeof term2 === "number") {
			subExpression.term2 = Math.round(subExpression.term2 * 1e9) / 1e9;
		}
	}
	return result.simplify();
};
const fitFunction = (func, points, inputVariables = ["x"]) => {
	/*
	`func` is the form of the function to be fitted (e.g. "ax^2 + bx + c"). It can be a string or an Expression.
	`inputVariables` are the variables (as opposed to the parameters that define the function)
	`points` is the set of points to fit the function to.
	The result will be a function that looks like `func`, but with the parameters replaced with actual values.
	*/
	if(typeof func === "string") { func = Expression.parse(func); }

	const distances = points.map(point => {
		if(point instanceof NVector) {
			const { numbers } = point;
			let substituted = func;
			for(const [i, number] of numbers.slice(0, ).entries()) {
				substituted = substituted.substitute(inputVariables[i], number);
			}
			return new Expression("-", substituted, numbers[numbers.length - 1]);
		}
		else {
			const { x, y } = point;
			return new Expression("-", func.substitute(inputVariables[0], x), y);
		}
	});
	const distancesSquared = distances.map(exp => new Expression("^", exp, 2).simplify());
	const sumOfDistSq = Expression.sum(...distancesSquared).simplify();
	const parameters = func.variables().difference(new Set(inputVariables));
	const equations = [];
	for(const parameter of parameters) {
		const derivative = sumOfDistSq.differentiate(parameter).simplify();
		equations.push(new Equation(derivative, 0));
	}
	const solutions = solveSystem(...equations);
	let result = func.clone();
	for(const [parameter, parameterValue] of Object.entries(solutions)) {
		result = result.substitute(parameter, parameterValue);
	}
	return result;
};

testing.addUnit("solveSystem()", {
	"can solve a system of linear equations": () => {
		const solutions = solveSystem(
			new Equation(Expression.parse("x + y"), 10),
			new Equation(Expression.parse("x - y"), 0)
		);
		const { x, y } = solutions;
		expect(x).toEqual(5);
		expect(y).toEqual(5);
	},
	"can solve a more complicated system of linear equations": () => {
		const equations = [
			new Equation(Expression.parse("(-76 + (12 * b)) + (40 * m)"), 0),
			new Equation(Expression.parse("(-22 + (6 * b)) + (12 * m)"), 0)
		];
		const solutions = solveSystem(...equations);
		const { m, b } = solutions;
		expect(m).toApproximatelyEqual(2, 1e-5);
		expect(b).toApproximatelyEqual(-1/3, 1e-5);
	}
});
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
testing.addUnit("fitPolynomialMV()", {
	"can fit a multivariable linear function to a set of 4 points - test case 1": () => {
		const points = [
			new NVector(0, 0, 1),
			new NVector(0, 1, 2),
			new NVector(1, 0, 2),
			new NVector(1, 1, 4)
		];
		const polynomial = fitPolynomialMV(1, 2, points);
		expect(`${polynomial}`).toEqual("((1 + a) + b) + (a * b)");
	},
	"can fit a multivariable linear function to a set of 4 points - test case 2": () => {
		const points = [
			new NVector(5, 6, 322),
			new NVector(9, 3, 292),
			new NVector(7, 8, 572),
			new NVector(1, 1, 24)
		];
		const polynomial = fitPolynomialMV(1, 2, points);
		expect(`${polynomial}`).toEqual("((7 + (3 * a)) + (5 * b)) + ((9 * a) * b)");
	},
	"can fit a multivariable quadratic to a set of 9 points": () => {
		const points = [
			new NVector(1, 1, 2),
			new NVector(1, 2, 4),
			new NVector(1, 3, 8),
			new NVector(2, 1, 7),
			new NVector(2, 2, 18),
			new NVector(2, 3, 37),
			new NVector(3, 1, 14),
			new NVector(3, 2, 40),
			new NVector(3, 3, 84)
		];
		// a^2b^2 + 2a - b
		const polynomial = fitPolynomialMV(2, 2, points);
		expect(`${polynomial}`).toEqual("((-1 * b) + (2 * a)) + ((a ^ 2) * (b ^ 2))");
	}
});
testing.addUnit("fitFunction()", {
	"can fit a line to two points": () => {
		const points = [ new Vector(0, 5), new Vector(1, 7) ];
		const result = new LinearExpression(fitFunction("a * x + b", points));
		// 2x + 5
		expect(result.coefficientOf("x")).toApproximatelyEqual(2, 0.01);
		expect(result.coefficientOf(null)).toApproximatelyEqual(5, 0.01);
	},
	"can approximately fit a line to three points": () => {
		const points = [
			new Vector(0, 0),
			new Vector(2, 3),
			new Vector(4, 8)
		];
		const result = new LinearExpression(fitFunction("m * x + b", points));
		// 2x - 1/3
		expect(result.coefficientOf("x")).toApproximatelyEqual(2, 0.01);
		expect(result.coefficientOf(null)).toApproximatelyEqual(-1/3, 0.01);
	}
});
testing.testUnit("solveSystem()");
testing.testUnit("fitFunction()");
