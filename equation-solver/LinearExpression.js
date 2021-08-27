/* represents a linear algebra LinearExpression consisting of a sum of LinearAlgebraTerms. */


class LinearExpression {
	constructor(terms) {
		if(typeof arguments[0] === "string") {
			const [variable] = arguments;
			const term = new LinearAlgebraTerm(variable, 1);
			this.terms = new Set([term]);
		}
		else if(typeof arguments[0] === "number") {
			const [number] = arguments;
			const term = new LinearAlgebraTerm(number);
			this.terms = new Set([term]);
		}
		else if(arguments[0] instanceof Expression) {
			const [expression] = arguments;
			this.terms = new Set();
			for(const term of expression.terms(true)) {
				const linearTerm = new LinearAlgebraTerm(term.term);
				if(term.negated) { linearTerm.coefficient *= -1; }
				this.terms.add(linearTerm);
			}
		}
		else if(terms instanceof Set) {
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
		return new LinearExpression(tokens.map(t => LinearAlgebraTerm.parse(t)));
	}

	combineLikeTerms() {
		const result = new LinearExpression([]);
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
		return new LinearExpression(this.terms.filter(t => t.coefficient !== 0));
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


testing.addUnit("LinearExpression.parse()", LinearExpression.parse, [
	["2x + 3y", new LinearExpression([new LinearAlgebraTerm(2, "x"), new LinearAlgebraTerm(3, "y")])],
	["5a - 4b", new LinearExpression([new LinearAlgebraTerm(5, "a"), new LinearAlgebraTerm(-4, "b")])],
	["-10p + 5q", new LinearExpression([new LinearAlgebraTerm(-10, "p"), new LinearAlgebraTerm(5, "q")])],
	["-4x - 3y", new LinearExpression([new LinearAlgebraTerm(-4, "x"), new LinearAlgebraTerm(-3, "y")])],

	["1.23x + 4.56y", new LinearExpression([new LinearAlgebraTerm(1.23, "x"), new LinearAlgebraTerm(4.56, "y")])],
	["1.23x - 4.56y", new LinearExpression([new LinearAlgebraTerm(1.23, "x"), new LinearAlgebraTerm(-4.56, "y")])],
	["-1.23x + 4.56y", new LinearExpression([new LinearAlgebraTerm(-1.23, "x"), new LinearAlgebraTerm(4.56, "y")])],
	["-1.23x - 4.56y", new LinearExpression([new LinearAlgebraTerm(-1.23, "x"), new LinearAlgebraTerm(-4.56, "y")])],

	["17x", new LinearExpression([new LinearAlgebraTerm(17, "x")])],
	["-5t", new LinearExpression([new LinearAlgebraTerm(-5, "t")])],
	["1.23x", new LinearExpression([new LinearAlgebraTerm(1.23, "x")])],
	["-5.893n", new LinearExpression([new LinearAlgebraTerm(-5.893, "n")])],

	["x + y", new LinearExpression([new LinearAlgebraTerm(1, "x"), new LinearAlgebraTerm(1, "y")])],
	["x - y", new LinearExpression([new LinearAlgebraTerm(1, "x"), new LinearAlgebraTerm(-1, "y")])],
	["-x + y", new LinearExpression([new LinearAlgebraTerm(-1, "x"), new LinearAlgebraTerm(1, "y")])],

	["123", new LinearExpression([new LinearAlgebraTerm(123, null)])],
	["-123", new LinearExpression([new LinearAlgebraTerm(-123, null)])],
	["4.56", new LinearExpression([new LinearAlgebraTerm(4.56, null)])],
	["-4.56", new LinearExpression([new LinearAlgebraTerm(-4.56, null)])],

	["x - 123", new LinearExpression([new LinearAlgebraTerm(1, "x"), new LinearAlgebraTerm(-123, null)])],
	["123 - x", new LinearExpression([new LinearAlgebraTerm(123, null), new LinearAlgebraTerm(-1, "x")])]
]);
testing.addUnit("LinearExpression.toString()", [
	(expr) => expr.toString(),
	[
		new LinearExpression([new LinearAlgebraTerm(1, "x")]),
		"x"
	],
	[
		new LinearExpression([new LinearAlgebraTerm(5, "x")]),
		"5x"
	],
	[
		new LinearExpression([new LinearAlgebraTerm(5, "x"), new LinearAlgebraTerm(3, "y")]),
		"5x + 3y"
	],
	[
		new LinearExpression([new LinearAlgebraTerm(5, "x"), new LinearAlgebraTerm(-3, "y")]),
		"5x - 3y"
	],
	[
		new LinearExpression([new LinearAlgebraTerm(-5, "x"), new LinearAlgebraTerm(3, "y")]),
		"-5x + 3y"
	],
	[
		new LinearExpression([new LinearAlgebraTerm(3, "x"), new LinearAlgebraTerm(-123, null)]),
		"3x - 123"
	],
	[
		new LinearExpression([new LinearAlgebraTerm(1, "a"), new LinearAlgebraTerm(-1, "b")]),
		"a - b"
	]
]);
testing.addUnit("LinearExpression.combineLikeTerms()", [
	(expr) => LinearExpression.parse(expr).combineLikeTerms().toString(),
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
