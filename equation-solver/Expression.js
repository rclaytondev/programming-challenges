/* represents a linear algebra expression consisting of a sum of AlgebraTerms. */


class Expression {
	constructor(terms) {
		if(terms instanceof Set) {
			this.terms = terms;
		}
		else {
			this.terms = new Set(terms);
		}
	}
	static parse(string) {
		const tokens = string.split(" ").filter(t => t !== "+");
		tokens.forEach((token, index) => {
			if(token === "-") {
				tokens.splice(index, 1);
				tokens[index] = "-" + tokens[index];
			}
		});
		return new Expression(tokens.map(t => AlgebraTerm.parse(t)));
	}

	combineLikeTerms() {
		const result = new Expression([]);
		this.terms.forEach(term => {
			const variableName = term.variableName;
			const preExistingTerm = result.terms.find(t => t.variableName === variableName);
			if(preExistingTerm) {
				preExistingTerm.coefficient += term.coefficient;
			}
			else {
				result.terms.add(term);
			}
		});
		return result;
	}
	removeZeroTerms() {
		return new Expression(this.terms.filter(t => t.coefficient !== 0));
	}

	toString() {
		const terms = [...this.terms].sort((a, b) => (a.variableName < b.variableName) ? -1 : 1);
		const termStrings = terms.map(t => t.toString());
		const result = termStrings.join(" + ");
		return result.replace(/ \+ -/g, " - ");
	}
	variables() {
		let variables = new Set([]);
		this.terms.forEach(term => {
			if(term.variableName != null) {
				variables.add(term.variableName);
			}
		});
		return variables;
	}
}


testing.addUnit("Expression.parse()", Expression.parse, [
	["2x + 3y", new Expression([new AlgebraTerm(2, "x"), new AlgebraTerm(3, "y")])],
	["5a - 4b", new Expression([new AlgebraTerm(5, "a"), new AlgebraTerm(-4, "b")])],
	["-10p + 5q", new Expression([new AlgebraTerm(-10, "p"), new AlgebraTerm(5, "q")])],
	["-4x - 3y", new Expression([new AlgebraTerm(-4, "x"), new AlgebraTerm(-3, "y")])],

	["1.23x + 4.56y", new Expression([new AlgebraTerm(1.23, "x"), new AlgebraTerm(4.56, "y")])],
	["1.23x - 4.56y", new Expression([new AlgebraTerm(1.23, "x"), new AlgebraTerm(-4.56, "y")])],
	["-1.23x + 4.56y", new Expression([new AlgebraTerm(-1.23, "x"), new AlgebraTerm(4.56, "y")])],
	["-1.23x - 4.56y", new Expression([new AlgebraTerm(-1.23, "x"), new AlgebraTerm(-4.56, "y")])],

	["17x", new Expression([new AlgebraTerm(17, "x")])],
	["-5t", new Expression([new AlgebraTerm(-5, "t")])],
	["1.23x", new Expression([new AlgebraTerm(1.23, "x")])],
	["-5.893n", new Expression([new AlgebraTerm(-5.893, "n")])],

	["x + y", new Expression([new AlgebraTerm(1, "x"), new AlgebraTerm(1, "y")])],
	["x - y", new Expression([new AlgebraTerm(1, "x"), new AlgebraTerm(-1, "y")])],
	["-x + y", new Expression([new AlgebraTerm(-1, "x"), new AlgebraTerm(1, "y")])],

	["123", new Expression([new AlgebraTerm(123, null)])],
	["-123", new Expression([new AlgebraTerm(-123, null)])],
	["4.56", new Expression([new AlgebraTerm(4.56, null)])],
	["-4.56", new Expression([new AlgebraTerm(-4.56, null)])],

	["x - 123", new Expression([new AlgebraTerm(1, "x"), new AlgebraTerm(-123, null)])],
	["123 - x", new Expression([new AlgebraTerm(123, null), new AlgebraTerm(-1, "x")])]
]);
testing.addUnit("Expression.toString()", [
	(expr) => expr.toString(),
	[
		new Expression([new AlgebraTerm(1, "x")]),
		"x"
	],
	[
		new Expression([new AlgebraTerm(5, "x")]),
		"5x"
	],
	[
		new Expression([new AlgebraTerm(5, "x"), new AlgebraTerm(3, "y")]),
		"5x + 3y"
	],
	[
		new Expression([new AlgebraTerm(5, "x"), new AlgebraTerm(-3, "y")]),
		"5x - 3y"
	],
	[
		new Expression([new AlgebraTerm(-5, "x"), new AlgebraTerm(3, "y")]),
		"-5x + 3y"
	],
	[
		new Expression([new AlgebraTerm(3, "x"), new AlgebraTerm(-123, null)]),
		"3x - 123"
	],
	[
		new Expression([new AlgebraTerm(1, "a"), new AlgebraTerm(-1, "b")]),
		"a - b"
	]
]);
testing.addUnit("Expression.combineLikeTerms()", [
	(expr) => Expression.parse(expr).combineLikeTerms().toString(),
	["x + x", "2x"],
	["y - y", "0"],
	["2x + 3x", "5x"],
	["1 + 2", "3"],
	["a + b", "a + b"],
	["2a + 3b", "2a + 3b"],
	["3x + y + 5x", "8x + y"],
	["3x + 2y + 5x + 3y", "8x + 5y"],
	["a + 2b - 3b + 4a", "5a - b"]
]);
