const ALPHABET = "abcdefghijklmnopqrstuvwxyz";
const minimize = (expression) => {
	const variables = [...expression.variables()];
	const derivatives = variables.map((v) => expression.differentiate(v).simplify());
	let guess = new NVector(...new Array(variables.length).fill(0));
	const NUM_ITERATIONS = 30;
	for(let i = 0; i < NUM_ITERATIONS; i ++) {
		if(expression.substitute(variables, guess.numbers).simplify() <= 1e-10) {
			break;
		}
		let newGuessNumbers = [];
		for(const [j, variable] of variables.entries()) {
			let derivative = derivatives[j];
			derivative = derivative.substitute(variables, guess.numbers);
			const slope = derivative.simplify();
			if(slope === 0) { slope = 0.0001; }
			newGuessNumbers[j] = guess.numbers[j] - (expression.substitute(variables, guess.numbers).simplify() / slope);
		}
		const combinations = Set.cartesianProduct(
			...new Array(variables.length)
			.fill()
			.map((v, i) => new Set([newGuessNumbers[i], guess.numbers[i]]))
		).filter(combination => !combination.equals(guess.numbers));
		guess = new NVector([...combinations].min((combination) =>
			expression.substitute(variables, combination).simplify()
		));
	}
	const result = {};
	for(const [i, number] of guess.numbers.entries()) {
		result[variables[i]] = number;
	}
	return result;
};
const solveSystem = (...equations) => {
	/* attempts to solve the system of equations using a multivariable generalization of Newton's method. */
	const variables = [...equations.map(eq => eq.variables()).reduce((a, b) => a.union(b))];
	const expressions = equations.map(equation => (
		new Expression("-", equation.leftSide, equation.rightSide).simplify()
	));
	const errors = expressions.map(exp => new Expression("^", exp, 2));
	const sumOfErrors = Expression.sum(...errors).simplify();
	return minimize(sumOfErrors);
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
			return new Expression("-", substituted, numbers[numbers.length - 1]).simplify();
		}
		else {
			const { x, y } = point;
			return new Expression("-", func.substitute(inputVariables[0], x), y).simplify();
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
testing.addUnit("minimize()", {
	"can minimize a linear expression": () => {
		const expression = Expression.parse(
			"((((((6260 + (-6608 * m)) + (-2088 * b)) + ((6 * b) ^ 2)) + ((12 * b) ^ 2)) + ((12 * m) ^ 2)) + ((40 * m) ^ 2)) + ((1104 * b) * m)"
		);
		const { m, b } = minimize(expression);
		expect(m).toApproximatelyEqual(2, 1e-5);
		expect(b).toApproximatelyEqual(-1/3, 1e-5);
	}
});
