class LinearEquation {
	constructor(linearExpression1, linearExpression2) {
		if(arguments[0] instanceof Equation) {
			const [equation] = arguments;
			this.linearExpression1 = new LinearExpression(equation.leftSide);
			this.linearExpression2 = new LinearExpression(equation.rightSide);
		}
		else {
			this.linearExpression1 = linearExpression1;
			this.linearExpression2 = linearExpression2;
		}
	}
	static parse(string) {
		const [expr1, expr2] = string.split("=");
		return new LinearEquation(
			LinearExpression.parse(expr1.trim()),
			LinearExpression.parse(expr2.trim())
		);
	}

	standardForm() {
		/* returns a new, equivalent equation, of the form '1x + 2y + 3z + ... = 12345' */
		let result = this.clone();
		this.linearExpression1.terms.forEach(term => {
			if(term.variableName == null) {
				result.subtract(term);
			}
		});
		this.linearExpression2.terms.forEach(term => {
			if(term.variableName != null) {
				result.subtract(term);
			}
		});
		result = result.combineLikeTerms().removeZeroTerms();
		if(result.linearExpression2.terms.size === 0) {
			result.linearExpression2.terms.add(new LinearAlgebraTerm(0, null));
		}
		return result;
	}

	combineLikeTerms() {
		return new LinearEquation(
			this.linearExpression1.combineLikeTerms(),
			this.linearExpression2.combineLikeTerms()
		);
	}
	removeZeroTerms() {
		return new LinearEquation(
			this.linearExpression1.removeZeroTerms(),
			this.linearExpression2.removeZeroTerms()
		);
	}

	add(linearAlgebraTerm) {
		this.linearExpression1.terms.add(linearAlgebraTerm);
		this.linearExpression2.terms.add(linearAlgebraTerm);
	}
	subtract(linearAlgebraTerm) {
		this.linearExpression1.terms.add(new LinearAlgebraTerm(-linearAlgebraTerm.coefficient, linearAlgebraTerm.variableName));
		this.linearExpression2.terms.add(new LinearAlgebraTerm(-linearAlgebraTerm.coefficient, linearAlgebraTerm.variableName));
	}

	toString() {
		return `${this.linearExpression1} = ${this.linearExpression2}`;
	}
	variables() {
		return this.linearExpression1.variables().union(this.linearExpression2.variables());
	}
}



testing.addUnit("LinearEquation.parse()", LinearEquation.parse, [
	[
		"x = y",
		new LinearEquation(
			new LinearExpression([new LinearAlgebraTerm(1, "x")]),
			new LinearExpression([new LinearAlgebraTerm(1, "y")]),
		)
	],
	[
		"3a = 10b",
		new LinearEquation(
			new LinearExpression([new LinearAlgebraTerm(3, "a")]),
			new LinearExpression([new LinearAlgebraTerm(10, "b")]),
		)
	],
	[
		"1.79a = 18.56b",
		new LinearEquation(
			new LinearExpression([new LinearAlgebraTerm(1.79, "a")]),
			new LinearExpression([new LinearAlgebraTerm(18.56, "b")]),
		)
	],
	[
		"-10a = -9b",
		new LinearEquation(
			new LinearExpression([new LinearAlgebraTerm(-10, "a")]),
			new LinearExpression([new LinearAlgebraTerm(-9, "b")]),
		)
	],
	[
		"10a + 6b = 4c + 18d",
		new LinearEquation(
			new LinearExpression([new LinearAlgebraTerm(10, "a"), new LinearAlgebraTerm(6, "b")]),
			new LinearExpression([new LinearAlgebraTerm(4, "c"), new LinearAlgebraTerm(18, "d")]),
		)
	],
	[
		"10a - 6b = 4c - 18d",
		new LinearEquation(
			new LinearExpression([new LinearAlgebraTerm(10, "a"), new LinearAlgebraTerm(-6, "b")]),
			new LinearExpression([new LinearAlgebraTerm(4, "c"), new LinearAlgebraTerm(-18, "d")]),
		)
	],
]);
testing.addUnit("LinearEquation.standardForm()", [
	(eq) => LinearEquation.parse(eq).standardForm().toString(),
	[
		"x + y = 4",
		"x + y = 4" // already in standard form
	],
	[
		"y = x + 10",
		"-x + y = 10"
	],
	[
		"a - b = c + d",
		"a - b - c - d = 0"
	],
	[
		"1a - 2b = 3c + 4d",
		"a - 2b - 3c - 4d = 0"
	],
	[
		"3x + 5 + 17x - 2 = 10 + 5x + 10x - 4",
		"5x = 3"
	]
]);
testing.addUnit("LinearEquation constructor", {
	"can construct a linear equation from a generic but linear equation": () => {
		const equation = new Equation(
			Expression.parse("x + (2 * y) - z"),
			5
		);
		const linearEquation = new LinearEquation(equation);
		expect(`${linearEquation}`).toEqual("x + 2y - z = 5");
	}
});
