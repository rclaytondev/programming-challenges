class LinearEquation {
	constructor(expression1, expression2) {
		this.expression1 = expression1;
		this.expression2 = expression2;
	}
	static parse(string) {
		const [expr1, expr2] = string.split("=");
		return new LinearEquation(
			Expression.parse(expr1.trim()),
			Expression.parse(expr2.trim())
		);
	}

	standardForm() {
		/* returns a new, equivalent equation, of the form '1x + 2y + 3z + ... = 12345' */
		let result = this.clone();
		this.expression1.terms.forEach(term => {
			if(term.variableName == null) {
				result.subtract(term);
			}
		});
		this.expression2.terms.forEach(term => {
			if(term.variableName != null) {
				result.subtract(term);
			}
		});
		result = result.combineLikeTerms().removeZeroTerms();
		if(result.expression2.terms.size === 0) {
			result.expression2.terms.add(new AlgebraTerm(0, null));
		}
		return result;
	}

	combineLikeTerms() {
		return new LinearEquation(
			this.expression1.combineLikeTerms(),
			this.expression2.combineLikeTerms()
		);
	}
	removeZeroTerms() {
		return new LinearEquation(
			this.expression1.removeZeroTerms(),
			this.expression2.removeZeroTerms()
		);
	}

	add(algebraTerm) {
		this.expression1.terms.add(algebraTerm);
		this.expression2.terms.add(algebraTerm);
	}
	subtract(algebraTerm) {
		this.expression1.terms.add(new AlgebraTerm(-algebraTerm.coefficient, algebraTerm.variableName));
		this.expression2.terms.add(new AlgebraTerm(-algebraTerm.coefficient, algebraTerm.variableName));
	}

	toString() {
		return `${this.expression1} = ${this.expression2}`;
	}
	variables() {
		return this.expression1.variables().union(this.expression2.variables());
	}
}



testing.addUnit("LinearEquation.parse()", LinearEquation.parse, [
	[
		"x = y",
		new LinearEquation(
			new Expression([new AlgebraTerm(1, "x")]),
			new Expression([new AlgebraTerm(1, "y")]),
		)
	],
	[
		"3a = 10b",
		new LinearEquation(
			new Expression([new AlgebraTerm(3, "a")]),
			new Expression([new AlgebraTerm(10, "b")]),
		)
	],
	[
		"1.79a = 18.56b",
		new LinearEquation(
			new Expression([new AlgebraTerm(1.79, "a")]),
			new Expression([new AlgebraTerm(18.56, "b")]),
		)
	],
	[
		"-10a = -9b",
		new LinearEquation(
			new Expression([new AlgebraTerm(-10, "a")]),
			new Expression([new AlgebraTerm(-9, "b")]),
		)
	],
	[
		"10a + 6b = 4c + 18d",
		new LinearEquation(
			new Expression([new AlgebraTerm(10, "a"), new AlgebraTerm(6, "b")]),
			new Expression([new AlgebraTerm(4, "c"), new AlgebraTerm(18, "d")]),
		)
	],
	[
		"10a - 6b = 4c - 18d",
		new LinearEquation(
			new Expression([new AlgebraTerm(10, "a"), new AlgebraTerm(-6, "b")]),
			new Expression([new AlgebraTerm(4, "c"), new AlgebraTerm(-18, "d")]),
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
