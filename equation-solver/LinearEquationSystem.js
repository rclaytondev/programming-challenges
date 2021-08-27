class LinearEquationSystem {
	constructor(equations) {
		this.equations = equations.map(equation => {
			if(equation instanceof LinearEquation) {
				return equation;
			}
			else {
				return LinearEquation.parse(equation);
			}
		});
	}

	variables() {
		let variables = new Set([]);
		this.equations.forEach(equation => {
			variables = variables.union(equation.variables());
		});
		return variables;
	}

	solve() {
		const standardForm = this.equations.map(eq => eq.standardForm());
		const variables = [...this.variables()];
		if(standardForm.length === 1 && variables.length === 1) {
			/* only one equation of the form ax = b --> x = b/a. */
			const variableName = variables[0];
			return {
				[variableName]: standardForm[0].linearExpression2.terms.onlyItem().coefficient / standardForm[0].linearExpression1.terms.onlyItem().coefficient
			};
		}
		const coefficientMatrix = new Matrix(
			standardForm.map(equation =>
				variables.map(variable => equation.linearExpression1.terms.find(t => t.variableName === variable)?.coefficient ?? 0)
			)
		);
		const weightedSumMatrix = new Matrix(standardForm.map(eq => [[...eq.linearExpression2.terms][0].coefficient]));
		const inverse = coefficientMatrix.inverse();
		const answers = inverse.multiply(weightedSumMatrix);
		const answersArray = answers.grid.rows.map(row => row[0]);
		const result = {};
		variables.forEach((variable, index) => {
			result[variable] = answersArray[index];
		});
		return result;
	}
	static solve(equations) {
		/* solves the equations. Equations can be LinearEquation objects or strings to parse. */
		return new LinearEquationSystem(equations).solve();
	}
}

testing.addUnit("LinearEquationSystem.variables()", [
	(equations) => new LinearEquationSystem(equations).variables(),
	[
		["x + y = 10", "x - y = 5"],
		new Set(["x", "y"]),
	],
	[
		["a = b + 5", "c = d"],
		new Set(["a", "b", "c", "d"])
	]
]);
testing.addUnit("LinearEquationSystem.solve()", [
	(equations) => new LinearEquationSystem(equations).solve(),
	[
		["x = 2x - 1"],
		{ x: 1 }
	],
	[
		["y = x", "y = -x + 10"],
		{ x: 5, y: 5 }
	]
]);
