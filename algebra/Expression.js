class ExpressionParseError extends Error {}
class Expression {
	constructor(operation, term1, term2) {
		this.operation = operation;
		this.term1 = term1;
		this.term2 = term2;
	}

	static tokenize(string) {
		const FIND_WHITESPACE = /\s+/g;
		const FIND_NUMBER = /^-?((\d+\.\d+)|(\d+))/;
		const FIND_VARIABLE = /^[A-Za-z]\w*/;
		const FIND_PARENTHESE = /^(\(|\))/;
		const FIND_OPERATOR = /^\+|-|\*|\/|\^/;
		const TOKEN_TYPES = [FIND_NUMBER, FIND_VARIABLE, FIND_PARENTHESE, FIND_OPERATOR];
		string = string.replace(FIND_WHITESPACE, "");
		const tokens = [];
		for(let i = 0; i < string.length; i ++) {
			const substring = string.substring(i);
			for(const regex of TOKEN_TYPES) {
				if(regex.test(substring)) {
					if(
						regex === FIND_NUMBER &&
						substring.startsWith("-") &&
						i !== 0 &&
						tokens[tokens.length - 1] !== "(" &&
						!FIND_OPERATOR.test(tokens[tokens.length - 1].token)
					) {
						tokens.push({ token: "-", type: "operator" });
						break;
					}
					const [token] = regex.exec(substring);
					tokens.push({
						token: token,
						type: (
							regex === FIND_NUMBER ? "number" :
							regex === FIND_VARIABLE ? "variable" :
							regex === FIND_PARENTHESE ? "parenthese" :
							"operator"
						)
					});
					i += token.length - 1;
					break;
				}
			}
		}
		return tokens;
	}
	static parse(string, tokens = Expression.tokenize(string)) {
		let depth = (tokens.max(t => t.depth).depth ?? 0) + 1;
		if(tokens.some(t => t.token === "(")) {
			const openingParenthese = tokens.findIndex(t => t.token === "(");
			const closingParenthese = tokens.findIndex(
				(t, i) => i > openingParenthese &&
				(tokens.slice(0, i + 1).count(v => v.token === "(") ===
				tokens.slice(0, i + 1).count(v => v.token === ")"))
			);
			const subExpressionTokens = tokens.slice(openingParenthese + 1, closingParenthese);
			const subExpression = Expression.parse(null, subExpressionTokens);
			const outerExpressionTokens = [
				...tokens.slice(0, openingParenthese),
				{ token: `NESTED_EXPRESSION_${depth}`, type: "meta-variable", depth },
				...tokens.slice(closingParenthese + 1)
			];
			if(outerExpressionTokens.length === 1) {
				return subExpression;
			}
			const outerExpression = Expression.parse(null, outerExpressionTokens);
			return outerExpression.substitute(`NESTED_EXPRESSION_${depth}`, subExpression);
		}
		for(let i = 0; i < tokens.length; i ++) {
			const token = tokens[i];
			const isUnaryMinus = (token.token === "-" && (
				i === 0 ||
				tokens[i - 1].token === "(" ||
				tokens[i - 1].type === "operator"
			));
			if(isUnaryMinus) {
				/* no parentheses --> minus sign only applies to next token */
				const negatedToken = tokens[i + 1];
				tokens.splice(
					i, 2,
					{ token: "(", type: "parenthese" },
					{ token: "0", type: "number" },
					{ token: "-", type: "operator" },
					negatedToken,
					{ token: ")", type: "parenthese" }
				);
				return Expression.parse(string, tokens);
			}
		}
		if(tokens.length === 1) {
			const [token] = tokens;
			if(token.type === "number") {
				return Number.parseFloat(token.token);
			}
			else if(token.type === "variable") {
				return token.token;
			}
			else {
				throw new ExpressionParseError(`Single-token expression: expected the token to be a number or a variable, but instead it was a ${token.type}`);
			}
		}
		if(tokens.length === 3) {
			return new Expression(
				tokens[1].token,
				(tokens[0].type === "number") ? Number.parseFloat(tokens[0].token) : tokens[0].token,
				(tokens[2].type === "number") ? Number.parseFloat(tokens[2].token) : tokens[2].token
			);
		}
		const ORDER_OF_OPERATIONS = [
			["^"],
			["*", "/"],
			["+", "-"]
		];
		for(const operators of ORDER_OF_OPERATIONS) {
			const firstOperatorIndex = tokens.findIndex(t => operators.includes(t.token));
			const firstOperator = tokens[firstOperatorIndex];
			if(firstOperatorIndex === -1) { continue; }
			const subExpressionTokens = tokens.slice(firstOperatorIndex - 1, firstOperatorIndex + 2);
			const subExpression = Expression.parse(null, subExpressionTokens);
			const outerExpressionTokens = [
				...tokens.slice(0, firstOperatorIndex - 1),
				{ token: `NESTED_EXPRESSION_${depth}`, type: "meta-variable", depth },
				...tokens.slice(firstOperatorIndex + 2)
			];
			const outerExpression = Expression.parse(null, outerExpressionTokens);
			return outerExpression.substitute(`NESTED_EXPRESSION_${depth}`, subExpression);
		}
	}
	toString() {
		const operand1 = (typeof this.term1 === "number" || typeof this.term1 === "string") ? this.term1 : `(${this.term1})`;
		const operand2 = (typeof this.term2 === "number" || typeof this.term2 === "string") ? this.term2 : `(${this.term2})`;
		return `${operand1} ${this.operation} ${operand2}`;
	}

	static sum(...terms) {
		if(terms.every(t => t.term instanceof Expression || typeof t.term === "string" || typeof t.term === "number")) {
			if(terms[0].negated) {
				terms.unshift({ negated: false, term: 0 });
			}
			let result = terms[0].term;
			for(const term of terms.slice(1)) {
				result = new Expression(term.negated ? "-" : "+", result, term.term);
			}
			return result;
		}

		if(terms.length === 1) {
			const [term] = terms;
			return term;
		}
		else if(terms.length === 2) {
			const [t1, t2] = terms;
			return new Expression("+", t1, t2);
		}
		else {
			const last = terms[terms.length - 1];
			const others = terms.slice(0, terms.length - 1);
			return new Expression("+", Expression.sum(...others), last);
		}
	}
	static product(...terms) {
		if(terms.every(t => t.term instanceof Expression || typeof t.term === "string" || typeof t.term === "number")) {
			if(terms[0].divided) {
				terms.unshift({ divided: false, term: 1 });
			}
			let result = terms[0].term;
			for(const term of terms.slice(1)) {
				result = new Expression(term.divided ? "/" : "*", result, term.term);
			}
			return result;
		}
		else {
			return terms.reduce((a, b) => new Expression("*", a, b));
		}
	}
	terms(extraInfo = false, negated = false) {
		if(extraInfo) {
			/*
			Returns a list of objects, where each object has a property `term`, representing the term, and a boolean property `negated`, representing whether the term is being subtracted or added.
			*/
			const terms = [];
			if(this.term1 instanceof Expression && ["+", "-"].includes(this.term1.operation)) {
				terms.push(...this.term1.terms(true, negated));
			}
			else {
				terms.push({ term: this.term1, negated: negated });
			}
			if(this.term2 instanceof Expression && ["+", "-"].includes(this.term2.operation)) {
				terms.push(...this.term2.terms(true, this.operation === "+" ? negated : !negated));
			}
			else {
				terms.push({ term: this.term2, negated: this.operation === "+" ? negated : !negated });
			}
			return terms;
		}
		else {
			/*
			Returns a list of all the terms in the sum, regardless of whether they are being added or subtracted.
			*/
			const terms = [];
			for(const term of [this.term1, this.term2]) {
				if(term instanceof Expression && ["+", "-"].includes(term.operation)) {
					terms.push(...term.terms());
				}
				else {
					terms.push(term);
				}
			}
			return terms;
		}
	}
	multiplicativeTerms(extraInfo = false, divided = false) {
		if(extraInfo) {
			const terms = [];
			if(this.term1 instanceof Expression && ["*", "/"].includes(this.term1.operation)) {
				terms.push(...this.term1.multiplicativeTerms(true, divided));
			}
			else {
				terms.push({ term: this.term1, divided });
			}
			if(this.term2 instanceof Expression && ["*", "/"].includes(this.term2.operation)) {
				terms.push(...this.term2.multiplicativeTerms(true, this.operation === "*" ? divided : !divided));
			}
			else {
				terms.push({ term: this.term2, divided: this.operation === "*" ? divided : !divided });
			}
			return terms;
		}
		else {
			const terms = [];
			for(const term of Tree.iterate(
				this,
				(term) => (["*", "/"].includes(term.operation) ? [term.term1, term.term2] : []),
				true
			)) {
				terms.push(term);
			}
			return terms;
		}
	}

	substitute(value, replacement) {
		const term1 = ((this.term1 instanceof Expression)
			? this.term1.substitute(value, replacement)
			: this.term1
		);
		const term2 = ((this.term2 instanceof Expression)
			? this.term2.substitute(value, replacement)
			: this.term2
		);
		return new Expression(
			this.operation,
			term1 === value ? replacement : term1,
			term2 === value ? replacement : term2,
		);
	}

	subExpressions() {
		return [
			this,
			...(this.term1.subExpressions?.() ?? []),
			...(this.term2.subExpressions?.() ?? []),
		];
	}
	variables(depth) {
		if(depth < 0) { return new Set(); }
		let variables = new Set([]);
		if(typeof this.term1 === "string") { variables.add(this.term1); }
		else if(this.term1 instanceof Expression) {
			variables = variables.union(this.term1.variables());
		}
		if(typeof this.term2 === "string") { variables.add(this.term2); }
		else if(this.term2 instanceof Expression) {
			variables = variables.union(this.term2.variables());
		}
		return variables;
	}

	isLinearTerm() {
		return (
			(this.operation === "*") && (
				(typeof this.term1 === "number" && typeof this.term2 === "string") ||
				(typeof this.term2 === "number" && typeof this.term1 === "string")
			)
		);
	}


	static SIMPLIFICATIONS = [
		{
			/* only works when the numbers are adjacent in the binary tree representing the expression. (I.e. it is not smart enough to simplify (1 + x) + 2.)*/
			name: "numeric-simplification",
			canApply: (expr) => {
				return (typeof expr.term1 === "number" && typeof expr.term2 === "number");
			},
			apply: (expr) => {
				switch (expr.operation) {
					case "+": return expr.term1 + expr.term2;
					case "-": return expr.term1 - expr.term2;
					case "*": return expr.term1 * expr.term2;
					case "/": return expr.term1 / expr.term2;
					case "^": return expr.term1 ^ expr.term2;
				}
			}
		},
		{
			name: "x^1 = x",
			canApply: (expr) => expr.operation === "^" && expr.term2 === 1,
			apply: (expr) => expr.term1
		},
		{
			name: "x^0 = 1",
			canApply: (expr) => expr.operation === "^" && expr.term2 === 0,
			apply: (expr) => 1
		},
		{
			name: "x*1 = x",
			canApply: (expr) => expr.operation === "*" && (expr.term1 === 1 || expr.term2 === 1),
			apply: (expr) => expr.term1 === 1 ? expr.term2 : expr.term1
		},
		{
			name: "x*0 = 0",
			canApply: (expr) => expr.operation === "*" && (expr.term1 === 0 || expr.term2 === 0),
			apply: (expr) => 0
		},
		{
			name: "x+0 = x",
			canApply: (expr) => expr.operation === "+" && (expr.term1 === 0 || expr.term2 === 0),
			apply: (expr) => (expr.term1 === 0) ? expr.term2 : expr.term1
		},
		{
			name: "combine-like-terms",
			termMatches: (t1, t2) => {
				if(typeof t1 === "object" && !(t1 instanceof Expression)) { t1 = t1.term; }
				if(typeof t2 === "object" && !(t2 instanceof Expression)) { t2 = t2.term; }
				const expr1 = [t1.term1, t1.term2].find(v => typeof v !== "number");
				const expr2 = [t2.term1, t2.term2].find(v => typeof v !== "number");
				if(expr1 != null && expr2 != null) { return expr1.equals(expr2); }
				else { return (expr1 == null) === (expr2 == null); }
			},
			getCoefficient: (expr) => {
				if(!(typeof expr === "object" && expr instanceof Expression)) { expr = expr.term; }
				if(expr.operation !== "*") { return null; }
				return [expr.term1, expr.term2].find(v => typeof v === "number");
			},
			canApply: (expr) => {
				if(expr.operation !== "+" && expr.operation !== "-") { return false; }
				const { termMatches, getCoefficient } = Expression.findSimplification("combine-like-terms");
				const terms = expr.terms(true).map(term => getCoefficient(term) == null
					? { term: new Expression("*", 1, term.term), negated: term.negated }
					: term
				);
				return terms.some(term1 => terms.some(term2 => (
					term1 !== term2 && termMatches(term1, term2)
				)));
			},
			apply: (expr) => {
				const { termMatches, getCoefficient } = Expression.findSimplification("combine-like-terms");
				const terms = expr.terms(true);
				const constantTerms = terms.filter(v => typeof v.term === "number");
				const otherTerms = (terms
					.filter(v => typeof v.term !== "number")
					.map(term => getCoefficient(term) == null
						? { term: new Expression("*", 1, term.term), negated: term.negated }
						: term
					)
				);
				const resultTerms = [];
				for(const [i, term] of otherTerms.entries()) {
					const multipliedExpression = [term.term.term1, term.term.term2].find(v => typeof v !== "number");
					const matchingTerms = otherTerms.filter(t => termMatches(t.term, term.term));
					const matchingIndicies = matchingTerms.map(t => otherTerms.indexOf(t));
					if(matchingIndicies.some(v => v < i)) { continue; }
					const coefficientSum = matchingTerms.sum(t =>
						(typeof t.term.term1 === "number" ? t.term.term1 : t.term.term2)
						* (t.negated ? -1 : 1)
					);
					if(coefficientSum === 1) { resultTerms.push(multipliedExpression); }
					else if(coefficientSum !== 0) {
						resultTerms.push(new Expression("*", coefficientSum, multipliedExpression))
					}
				}
				return Expression.sum(...resultTerms, constantTerms.map(v => v.term).sum());
			}
		},
		{
			// e.g. (a + b) * (c + d) = ac + ad + bc + bd
			name: "multiply",
			canApply: (expr) => {
				const { term1, term2 } = expr;
				return (
					expr.operation === "*" &&
					(term1.operation === "+" || term1.operation === "-") &&
					(term2.operation === "+" || term2.operation === "-")
				);
			},
			apply: (expr) => {
				let result = null;
				for(const [i, t1] of [expr.term1.term1, expr.term1.term2].entries()) {
					for(const [j, t2] of [expr.term2.term1, expr.term2.term2].entries()) {
						result = ((result == null)
							? new Expression("*", t1, t2)
							: new Expression("+", result, new Expression("*", t1, t2))
						);
						const isInverted = (i === 1 && expr.term1.operation === "-") !== (j === 1 && expr.term2.operation === "-");
						if(isInverted) { result.operation = "-"; }
					}
				}
				return result;
			}
		},
		{
			// e.g. 2(x + y) = 2x + 2y
			name: "distribute",
			canApply: (term) => (
				term.operation === "*" &&
				(term.term1.operation === "+" || term.term1.operation === "-")
				!== (term.term2.operation === "+" || term.term2.operation === "-")
			),
			apply: (expr) => {
				const expr1 = (expr.term1.operation === "+" || expr.term1.operation === "-") ? expr.term2 : expr.term1;
				const expr2 = (expr.term1.operation === "+" || expr.term1.operation === "-") ? expr.term1 : expr.term2;
				return new Expression(
					expr2.operation,
					new Expression("*", expr1, expr2.term1),
					new Expression("*", expr1, expr2.term2),
				);
			}
		},
		{
			/* rearranges sums of multiple things to make other simplifications easier. */
			name: "rearrange-addition",
			compareTerms: (term1, term2) => {
				if(typeof term1 !== typeof term2) {
					/* sort numbers before variables and variables before subexpressions */
					const order = ["number", "string", "object"];
					return Array.SORT_ASCENDING(
						order.indexOf(typeof term1),
						order.indexOf(typeof term2)
					);
				}
				else {
					if(term1.equals(term2)) { return 0; }
					else if(typeof term1 === "number") {
						return Array.SORT_ASCENDING(term1, term2);
					}
					else if(typeof term1 === "string") {
						return term1.localeCompare(term2);
					}
					else if(term1 instanceof Expression && term2 instanceof Expression) {
						const { compareTerms } = Expression.findSimplification("rearrange-addition");
						/* find the first value in the tree where they aren't equal and compare using that */
						for(const [value1, value2] of Tree.iterate(
							[term1, term2],
							([t1, t2]) => [[t1.term1, t2.term1], [t1.term2, t2.term2]].filter(v => !v.includes(undefined))
						)) {
							if(!value1.equals(value2) && value1 !== term1 && value2 !== term2) {
								return compareTerms(value1, value2);
							}
						}
					}
					else {
						throw new Error("Unexpected.");
					}
				}
			},
			canApply: (expr) => {
				if(expr.operation !== "+" && expr.operation !== "-") { return false; }
				for(const term of Tree.iterate(
					expr,
					(ex) => ["+", "-"].includes(ex.operation) ? [ex.term1, ex.term2] : []
				)) {
					/* addition should be evaluated left-to-right (i.e. there should be no parentheses) */
					if(
						["+", "-"].includes(term.operation) &&
						["+", "-"].includes(term.term2.operation)
					) { return true; }
				}
				const terms = expr.terms();
				const { compareTerms } = Expression.findSimplification("rearrange-addition");
				return !terms.isSorted(compareTerms);
			},
			apply: (expr) => {
				const terms = expr.terms(true);
				const { compareTerms } = Expression.findSimplification("rearrange-addition");
				const newTerms = terms.sort((a, b) => compareTerms(a.term, b.term));
				return Expression.sum(...newTerms);
			}
		},
		{
			name: "rearrange-multiplication",
			canApply: (expr) => {
				if(expr.operation !== "*" && expr.operation !== "/") { return false; }
				const terms = expr.multiplicativeTerms();
				for(const term of Tree.iterate(
					expr,
					(ex) => ["*", "/"].includes(ex.operation) ? [ex.term1, ex.term2] : []
				)) {
					/* addition should be evaluated left-to-right (i.e. there should be no parentheses) */
					if(
						["*", "/"].includes(term.operation) &&
						["*", "/"].includes(term.term2.operation)
					) { return true; }
				}
				const { compareTerms } = Expression.findSimplification("rearrange-addition");
				return !terms.isSorted(compareTerms);
			},
			apply: (expr) => {
				const terms = expr.multiplicativeTerms(true);
				const { compareTerms } = Expression.findSimplification("rearrange-addition");
				const newTerms = terms.sort((a, b) => compareTerms(a.term, b.term));
				return Expression.product(...newTerms);
			}
		}
	];
	static findSimplification(simplificationID) {
		return Expression.SIMPLIFICATIONS.find(s => s.name === simplificationID);
	}
	static simplify(expression, simplificationID = "all", simplifications = Expression.SIMPLIFICATIONS) {
		if(simplificationID !== "all") {
			const simplification = simplifications.find(s => s.name === simplificationID);
			const term1 = (expression.term1 instanceof Expression
				? Expression.simplify(expression.term1, simplificationID, simplifications)
				: expression.term1
			);
			const term2 = (expression.term2 instanceof Expression
				? Expression.simplify(expression.term2, simplificationID, simplifications)
				: expression.term2
			);
			const newExpression = new Expression(expression.operation, term1, term2);
			return simplification.canApply(newExpression) ? simplification.apply(newExpression) : newExpression;
		}
		whileLoop: while(true) {
			if(!(expression instanceof Expression)) { return expression; }
			const subExpressions = expression.subExpressions();
			for(const simplification of simplifications) {
				if(subExpressions.some(e => simplification.canApply(e))) {
					expression = Expression.simplify(expression, simplification.name, [simplification]);
					continue whileLoop;
				}
			}
			return expression;
		}
	}
	simplify(simplificationID = "all", simplifications = Expression.SIMPLIFICATIONS) {
		return Expression.simplify(this, simplificationID, simplifications);
	}

	static DERIVATIVE_RULES = [
		{
			name: "sum-rule",
			canApply: (expr) => (expr.operation === "+"),
			apply: ({ term1, term2 }, variable) => new Expression(
				"+",
				Expression.differentiate(term1, variable),
				Expression.differentiate(term2, variable)
			)
		},
		{
			name: "difference-rule",
			canApply: (expr) => (expr.operation === "-"),
			apply: ({ term1, term2 }, variable) => new Expression(
				"-",
				Expression.differentiate(term1, variable),
				Expression.differentiate(term2, variable)
			)
		},
		{
			name: "product-rule",
			canApply: (expr) => (expr.operation === "*"),
			apply: ({ term1, term2 }, variable) => new Expression(
				"+",
				new Expression(
					"*",
					Expression.differentiate(term1, variable),
					term2
				),
				new Expression(
					"*",
					term1,
					Expression.differentiate(term2, variable),
				),
			)
		},
		{
			name: "power-rule",
			canApply: (expr) => (expr.operation === "^" && typeof expr.term2 === "number"),
			apply: ({ term1, term2 }, variable) => new Expression(
				"*",
				term2,
				new Expression(
					"*",
					new Expression("^", term1, term2 - 1),
					Expression.differentiate(term1, variable)
				)
			)
		}
	];
	static differentiate(expr, variable) {
		if(typeof expr === "number") { return 0; }
		else if(typeof expr === "string") {
			return (expr === variable) ? 1 : 0;
		}
		else {
			for(const derivativeRule of Expression.DERIVATIVE_RULES) {
				if(derivativeRule.canApply(expr, variable)) {
					return derivativeRule.apply(expr, variable);
				}
			}
			throw new Error("Expression format not supported.");
		}
	}
	differentiate(variable) {
		return Expression.differentiate(this, variable);
	}
}

testing.addUnit("Expression.toString()", {
	"returns the string representation of x + 1": () => {
		const term = new Expression("+", "x", 1);
		expect(term.toString()).toEqual("x + 1");
	},
	"returns the string representation of 2 * (x - 3)": () => {
		const term = new Expression("*", 2, new Expression("-", "x", 3));
		expect(term.toString()).toEqual("2 * (x - 3)");
	}
});
testing.addUnit("Expression.tokenize()", {
	"can tokenize an expression with single-letter variables": () => {
		const tokens = Expression.tokenize("x + y");
		expect(tokens).toEqual([
			{ token: "x", type: "variable" },
			{ token: "+", type: "operator" },
			{ token: "y", type: "variable" }
		]);
	},
	"can tokenize an expression with weird whitespace": () => {
		const tokens = Expression.tokenize("   x  +	  y ");
		expect(tokens).toEqual([
			{ token: "x", type: "variable" },
			{ token: "+", type: "operator" },
			{ token: "y", type: "variable" }
		]);
	},
	"can tokenize an expression with no whitespace": () => {
		const tokens = Expression.tokenize("x+y-z");
		expect(tokens).toEqual([
			{ token: "x", type: "variable" },
			{ token: "+", type: "operator" },
			{ token: "y", type: "variable" },
			{ token: "-", type: "operator" },
			{ token: "z", type: "variable" }
		]);
	},
	"can tokenize an expression with numbers": () => {
		const tokens = Expression.tokenize("1 + 2");
		expect(tokens).toEqual([
			{ token: "1", type: "number" },
			{ token: "+", type: "operator" },
			{ token: "2", type: "number" }
		]);
	},
	"can tokenize an expression with parentheses": () => {
		const tokens = Expression.tokenize("1 + (2 * (3 ^ 4))");
		expect(tokens).toEqual([
			{ token: "1", type: "number" },
			{ token: "+", type: "operator" },
			{ token: "(", type: "parenthese" },
			{ token: "2", type: "number" },
			{ token: "*", type: "operator" },
			{ token: "(", type: "parenthese" },
			{ token: "3", type: "number" },
			{ token: "^", type: "operator" },
			{ token: "4", type: "number" },
			{ token: ")", type: "parenthese" },
			{ token: ")", type: "parenthese" },
		]);
	},
	"can tokenize an expression with numbers containing decimal points": () => {
		const tokens = Expression.tokenize("1.2 + 3.4");
		expect(tokens).toEqual([
			{ token: "1.2", type: "number" },
			{ token: "+", type: "operator" },
			{ token: "3.4", type: "number" }
		]);
	},
	"can tokenize an expression with negative numbers": () => {
		const tokens = Expression.tokenize("1 + -2");
		expect(tokens).toEqual([
			{ token: "1", type: "number" },
			{ token: "+", type: "operator" },
			{ token: "-2", type: "number" }
		]);
	},
	"can tokenize an expression with multi-letter variable names containing numbers and underscores": () => {
		const tokens = Expression.tokenize("fOo123_4 - BAr_7_8__9");
		expect(tokens).toEqual([
			{ token: "fOo123_4", type: "variable" },
			{ token: "-", type: "operator" },
			{ token: "BAr_7_8__9", type: "variable" }
		]);
	}
});
testing.addUnit("Expression.parse()", {
	"can parse a simple expression": () => {
		const term = Expression.parse("x + 2");
		expect(term).toEqual(new Expression("+", "x", 2));
	},
	"can parse an expression with weird whitespace": () => {
		const term = Expression.parse("   x +    2       ");
		expect(term).toEqual(new Expression("+", "x", 2));
	},
	"can parse an expression with no whitespace": () => {
		const term = Expression.parse("x+2");
		expect(term).toEqual(new Expression("+", "x", 2));
	},
	"can parse an expression with parentheses": () => {
		const term = Expression.parse("(x + 1) * 2");
		expect(term).toEqual(
			new Expression("*",
				new Expression("+", "x", 1),
				2
			)
		);
	},
	"can parse an expression with redundant parentheses": () => {
		const term = Expression.parse("((((5)))) + ((x))");
		expect(term).toEqual(new Expression("+", 5, "x"));
	},
	"can parse an expression containing a non-integer": () => {
		const term = Expression.parse("1.23 * x");
		expect(term).toEqual(new Expression("*", 1.23, "x"));
	},
	"can parse an expression containing a negative number": () => {
		const term = Expression.parse("-123 * x");
		expect(term).toEqual(new Expression("*", -123, "x"));
	},
	"can parse an expression with a negative sign at the beginning of the string": () => {
		const term = Expression.parse("-x + 3");
		expect(term).toEqual(new Expression("+", new Expression("-", 0, "x"), 3));
	},
	"can parse an expression with a negative sign at the beginning of a parenthesized subexpression": () => {
		const term = Expression.parse("5 + (-x)");
		expect(term).toEqual(new Expression("+", 5, new Expression("-", 0, "x")));
	},
	"can parse an expression with a negative sign after another operator": () => {
		const term = Expression.parse("5 * -x");
		expect(term).toEqual(new Expression("*", 5, new Expression("-", 0, "x")));
	},
	"can parse an expression with a negative sign in front of parentheses": () => {
		const term = Expression.parse("5 * -(x)");
		expect(term).toEqual(new Expression("*", 5, new Expression("-", 0, "x")));
	},
	"can parse an expression with a multi-letter, multi-number variable name": () => {
		const term = Expression.parse("foo123 / 17");
		expect(term).toEqual(new Expression("/", "foo123", 17));
	},
	"can parse a multi-operator expression without parentheses": () => {
		const term = Expression.parse("y + 7 - 3");
		expect(term).toEqual(new Expression("-", new Expression("+", "y", 7), 3));
	},
	"can parse an expression with a single pair of parentheses": () => {
		const term = Expression.parse("2 * (x + 1)");
		expect(term).toEqual(new Expression("*", 2, new Expression("+", "x", 1)));
	},
	"correctly uses the order of operations when there are no parentheses": () => {
		const term = Expression.parse("x + y * z"); // x + (y * z), not (x + y) * z
		expect(term).toEqual(new Expression("+", "x", new Expression("*", "y", "z")));
	},
	"correctly uses the order of operations when there are equal-precedence operators - test case 1": () => {
		const term = Expression.parse("x + y - z");
		expect(term).toEqual(new Expression("-", new Expression("+", "x", "y"), "z"));
	},
	"correctly uses the order of operations when there are equal-precedence operators - test case 2": () => {
		const term = Expression.parse("x - y + z");
		expect(term).toEqual(new Expression("+", new Expression("-", "x", "y"), "z"));
	},
	"correctly parses 2x + 3y + 4x + 5y (regression test)": () => {
		const term = Expression.parse("(2*x) + (3*y) + (4*x) + (5*y)");
		expect(term).toEqual(new Expression(
			"+",
			new Expression(
				"+",
				new Expression(
					"+",
					new Expression("*", 2, "x"),
					new Expression("*", 3, "y")
				),
				new Expression("*", 4, "x")
			),
			new Expression("*", 5, "y")
		));
	}
});
testing.addUnit("Expression.sum()", {
	"correctly returns the sum of a single term": () => {
		const term = new Expression("*", "x", 2);
		const sum = Expression.sum(term);
		expect(sum).toEqual(term);
	},
	"correctly returns the sum of two terms": () => {
		const term1 = new Expression("*", "x", 2);
		const term2 = new Expression("*", "x", 3);
		const sum = Expression.sum(term1, term2);
		expect(sum).toEqual(new Expression("+", term1, term2));
	},
	"correctly returns the sum of three terms": () => {
		const term1 = new Expression("*", "x", 2);
		const term2 = new Expression("*", "x", 3);
		const term3 = new Expression("*", "x", 4);
		const sum = Expression.sum(term1, term2, term3);
		expect(sum).toEqual(new Expression("+", new Expression("+", term1, term2), term3));
	},
	"correctly returns the sum / difference of multiple terms": () => {
		const terms = [
			{ term: "x", negated: false },
			{ term: "y", negated: true },
			{ term: "z", negated: false },
		];
		const sum = Expression.sum(...terms);
		expect(`${sum}`).toEqual("(x - y) + z");
	},
	"correctly returns the sum / difference of multiple terms when the first term is subtracted": () => {
		const terms = [
			{ term: "x", negated: true },
			{ term: "y", negated: false },
			{ term: "z", negated: true },
		];
		const sum = Expression.sum(...terms);
		expect(`${sum}`).toEqual("((0 - x) + y) - z");
	},

});
testing.addUnit("Expression.substitute()", {
	"can replace a variable with another variable": () => {
		const term = new Expression("+", "x", 2); // x + 2
		const substituted = term.substitute("x", "y");
		expect(substituted.toString()).toEqual("y + 2");
	},
	"can replace a variable with another variable in a nested expression": () => {
		const term = new Expression("*", new Expression("+", "x", 2), 3); // (x + 2) * 3
		const substituted = term.substitute("x", "y");
		expect(substituted.toString()).toEqual("(y + 2) * 3");
	},
	"can replace a variable with a number": () => {
		const term = new Expression("/", "x", 2); // x/2
		const substituted = term.substitute("x", 3);
		expect(substituted.toString()).toEqual("3 / 2");
	},
	"can replace a variable with a number in a nested expression": () => {
		const term = new Expression("*", new Expression("+", "x", 2), 5); // (x + 2) * 5
		const substituted = term.substitute("x", 3);
		expect(substituted.toString()).toEqual("(3 + 2) * 5");
	},
	"can replace a variable with an expression": () => {
		const term = new Expression("*", "x", 5);
		const substituted = term.substitute("x", new Expression("+", "x", 2));
		expect(substituted.toString()).toEqual("(x + 2) * 5");
	},
	"can replace a variable with an expression in a nested expression": () => {
		const term = new Expression("*", new Expression("+", "x", 2), 5); // (x + 2) * 5
		const substituted = term.substitute("x", new Expression("/", "y", 3));
		expect(substituted.toString()).toEqual("((y / 3) + 2) * 5");
	}
});
(() => {
	const testSimplification = {
		name: "replace-x-with-y",
		canApply: ({ term1, term2 }) => term1 === "x" || term2 === "x",
		apply: (expr) => {
			const t1 = (expr.term1 === "x" ? "y" : expr.term1);
			const t2 = (expr.term2 === "x" ? "y" : expr.term2);
			return new Expression(expr.operation, t1, t2);
		}
	};
	testing.addUnit("Expression.simplify()", {
		"can fully simplify an expression": () => {
			const expr = Expression.parse("x + 1");
			const simplified = Expression.simplify(expr, "all", [testSimplification]);
			expect(`${simplified}`).toEqual("y + 1");
		},
		"can apply a specific simplification": () => {
			const expr = Expression.parse("x + 1");
			const simplified = Expression.simplify(expr, "replace-x-with-y", [testSimplification]);
			expect(`${simplified}`).toEqual("y + 1");
		},
		"returns the original expression when no simplifications are applicable": () => {
			const expr = Expression.parse("z + 1");
			const simplified = Expression.simplify(expr, "replace-x-with-y", [testSimplification]);
			expect(`${simplified}`).toEqual("z + 1");
		},
		"can simplify using non-top-level simplifications": () => {
			const expr = Expression.parse("(x + 1) * 2");
			const simplified = Expression.simplify(expr, "all", [testSimplification]);
			expect(`${simplified}`).toEqual("(y + 1) * 2");
		},
		"can apply a specific non-top-level simplification": () => {
			const expr = Expression.parse("(x + 1) * 2");
			const simplified = Expression.simplify(expr, "replace-x-with-y", [testSimplification]);
			expect(`${simplified}`).toEqual("(y + 1) * 2");
		}
	});
}) ();
testing.addUnit("Expression.differentiate()", [
	() => {
		const expr = Expression.parse("a + 2*b - 5");
		const result = expr.differentiate("a").simplify();
		expect(result).toEqual(1);
	},
	() => {
		const expr = Expression.parse("(a + b)^2");
		const result = expr.differentiate("a").simplify();
		expect(`${result}`).toEqual(`(2 * a) + (2 * b)`);
	}
]);
testing.addUnit("Expression.simplify() - combine-like-terms", {
	"works in the basic case": () => {
		const term = Expression.parse("2 * x + 3 * x");
		const simplified = term.simplify();
		expect(`${simplified}`).toEqual("5 * x");
	},
	"works when the variables are being multiplied in a different order": () => {
		const term = Expression.parse("2 * x + x * 3");
		const simplified = term.simplify();
		expect(`${simplified}`).toEqual("5 * x");
	},
	"works when there are multiple pairs of non-adjacent terms to be combined": () => {
		const term = Expression.parse("(2*x) + (3*y) + (4*x) + (5*y)");
		const simplified = term.simplify();
		expect(`${simplified}`).toEqual("(6 * x) + (8 * y)");
	},
	"works when a term is being subtracted": () => {
		const term = Expression.parse("5 * x - 3 * x");
		const simplified = term.simplify();
		expect(`${simplified}`).toEqual("2 * x");
	},
	"works when the terms to be combined are non-adjacent": () => {
		const term = Expression.parse("2 * x + (y * z) + 3 * x");
		const simplified = term.simplify();
		expect(`${simplified}`).toEqual("(5 * x) + (y * z)");
	},
	"can simplify an expression that is a sum of multiples of the same expression": () => {
		const term = Expression.parse("2 * (x * y) + 3 * (x * y)");
		const simplified = term.simplify();
		expect(`${simplified}`).toEqual("(5 * x) * y");
	},
	"works when there is a variable without a coefficient": () => {
		const simplification = Expression.findSimplification("combine-like-terms");
		const term = Expression.parse("(2 * x) + (3 * x) + x");
		expect(simplification.canApply(term)).toEqual(true);
		const simplified = term.simplify();
		expect(`${simplified}`).toEqual("6 * x");
	},
	"works when there is a variable, an expression, and a number": () => {
		const simplification = Expression.findSimplification("combine-like-terms");
		const term = Expression.parse("x + (y * z) + 5");
		expect(simplification.canApply(term)).toEqual(false);
	},
	"works when there are multiple subexpressions without a coefficient": () => {
		const simplification = Expression.findSimplification("combine-like-terms");
		const term = Expression.parse("2*(x*y) + (x*y)");
		expect(simplification.canApply(term)).toEqual(true);
		const simplified = term.simplify();
		expect(`${simplified}`).toEqual("(3 * x) * y");
	},
	"works when there are non-adjacent constant terms": () => {
		const term = Expression.parse("(1 + x) + 2");
		const simplified = term.simplify();
		expect(`${simplified}`).toEqual("3 + x");
	}
});
testing.addUnit("Expression.simplify() - multiply", {
	"can multiply expressions in the basic case": () => {
		const term = Expression.parse("(a + b) * (a + b)");
		const simplified = term.simplify();
		expect(`${simplified}`).toEqual("((a * a) + (b * b)) + ((2 * a) * b)");
	}
});
testing.addUnit("Expression.simplify() - distribute", {
	"can distribute multiplication in the basic case": () => {
		const term = Expression.parse("2 * (x + y)");
		const simplified = term.simplify();
		expect(`${simplified}`).toEqual("(2 * x) + (2 * y)");
	}
});
testing.addUnit("Expression.simplify() - rearrange-addition", {
	"works in the basic case": () => {
		const term = Expression.parse("(2 + x) + 3");
		const simplified = Expression.findSimplification("rearrange-addition").apply(term);
		expect(`${simplified}`).toEqual("(2 + 3) + x");
	},
	"rearranges polynomials into the expected order": () => {
		const term = Expression.parse("x^5 + x^2 + 5 + x^4 + x^3 + x + x^7");
		const simplified = Expression.findSimplification("rearrange-addition").apply(term);
		expect(`${simplified}`).toEqual("(((((5 + x) + (x ^ 2)) + (x ^ 3)) + (x ^ 4)) + (x ^ 5)) + (x ^ 7)");
	},
	"works when there are terms being added and subtracted": () => {
		const term = Expression.parse("x + z - y");
		const simplified = Expression.findSimplification("rearrange-addition").apply(term);
		expect(`${simplified}`).toEqual("(x - y) + z");
	},
	"works when the term being subtracted becomes the first term after rearranging": () => {
		const term = Expression.parse("y - x");
		const simplified = Expression.findSimplification("rearrange-addition").apply(term);
		expect(`${simplified}`).toEqual("(0 - x) + y");
	},
	"works when the terms are in the right order, but are being added in the wrong order": () => {
		const term = Expression.parse("2 + (2 + x)");
		expect(Expression.findSimplification("rearrange-addition").canApply(term)).toEqual(true);
		const simplified = Expression.findSimplification("rearrange-addition").apply(term);
		expect(`${simplified}`).toEqual("(2 + 2) + x");
	}
});
testing.addUnit("Expression.simplify() - rearrange-multiplication", {
	"works in the basic case": () => {
		const term = Expression.parse("(2 * x) * 3");
		const simplified = Expression.findSimplification("rearrange-multiplication").apply(term);
		expect(`${simplified}`).toEqual("(2 * 3) * x");
	},
	"works when the terms are in the right order, but are being multiplied in the wrong order": () => {
		const term = Expression.parse("2 * (2 * x)");
		expect(Expression.findSimplification("rearrange-multiplication").canApply(term)).toEqual(true);
		const simplified = Expression.findSimplification("rearrange-multiplication").apply(term);
		expect(`${simplified}`).toEqual("(2 * 2) * x");
	}
});
testing.addUnit("Expression.terms()", {
	"can return the terms of a sum of two variables": () => {
		const result = Expression.parse("x + y").terms();
		expect(result).toEqual(["x", "y"]);
	},
	"can return the terms of a difference of two variables": () => {
		const result = Expression.parse("x - y").terms();
		expect(result).toEqual(["x", "y"]);
	},
	"can return the terms of a sum of three or more variables": () => {
		const result = Expression.parse("x + y + z").terms();
		expect(result).toEqual(["x", "y", "z"]);
	},
	"can return the terms and signs of a sum of three or more variables": () => {
		const result = Expression.parse("x + y + z").terms(true);
		expect(result).toEqual([
			{ term: "x", negated: false },
			{ term: "y", negated: false },
			{ term: "z", negated: false },
		]);
	},
	"can return the terms and signs of a sum / difference": () => {
		const result = Expression.parse("x - y + z").terms(true);
		expect(result).toEqual([
			{ term: "x", negated: false },
			{ term: "y", negated: true },
			{ term: "z", negated: false },
		]);
	},
	"can return the terms and signs of a sum / difference with parentheses": () => {
		const result = Expression.parse("x - (y + z)").terms(true);
		expect(result).toEqual([
			{ term: "x", negated: false },
			{ term: "y", negated: true },
			{ term: "z", negated: true },
		]);
	},
});
