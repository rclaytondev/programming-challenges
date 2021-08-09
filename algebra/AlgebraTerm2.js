class AlgebraParseError extends Error {}
class AlgebraTerm2 {
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
	static parse(string, tokens = AlgebraTerm2.tokenize(string)) {
		const depth = tokens.count(t => t.type === "meta-variable");
		if(tokens.some(t => t.token === "(")) {
			const openingParenthese = tokens.findIndex(t => t.token === "(");
			const closingParenthese = tokens.findIndex(
				(t, i) => i > openingParenthese &&
				(tokens.slice(0, i + 1).count(v => v.token === "(") ===
				tokens.slice(0, i + 1).count(v => v.token === ")"))
			);
			const subExpressionTokens = tokens.slice(openingParenthese + 1, closingParenthese);
			const subExpression = AlgebraTerm2.parse(null, subExpressionTokens);
			const outerExpressionTokens = [
				...tokens.slice(0, openingParenthese),
				{ token: `NESTED_EXPRESSION_${depth}`, type: "meta-variable" },
				...tokens.slice(closingParenthese + 1)
			];
			if(outerExpressionTokens.length === 1) {
				return subExpression;
			}
			const outerExpression = AlgebraTerm2.parse(null, outerExpressionTokens);
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
				return AlgebraTerm2.parse(string, tokens);
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
				throw new AlgebraParseError(`Single-token expression: expected the token to be a number or a variable, but instead it was a ${token.type}`);
			}
		}
		if(tokens.length === 3) {
			return new AlgebraTerm2(
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
			const subExpression = AlgebraTerm2.parse(null, subExpressionTokens);
			const outerExpressionTokens = [
				...tokens.slice(0, firstOperatorIndex - 1),
				{ token: `NESTED_EXPRESSION_${depth}`, type: "meta-variable" },
				...tokens.slice(firstOperatorIndex + 2)
			];
			const outerExpression = AlgebraTerm2.parse(null, outerExpressionTokens);
			return outerExpression.substitute(`NESTED_EXPRESSION_${depth}`, subExpression);
		}
	}
	toString() {
		const operand1 = (typeof this.term1 === "number" || typeof this.term1 === "string") ? this.term1 : `(${this.term1})`;
		const operand2 = (typeof this.term2 === "number" || typeof this.term2 === "string") ? this.term2 : `(${this.term2})`;
		return `${operand1} ${this.operation} ${operand2}`;
	}

	static sum(...terms) {
		if(terms.length === 1) {
			const [term] = terms;
			return term;
		}
		else if(terms.length === 2) {
			const [t1, t2] = terms;
			return new AlgebraTerm2("+", t1, t2);
		}
		else {
			const last = terms[terms.length - 1];
			const others = terms.slice(0, terms.length - 1);
			return new AlgebraTerm2("+", AlgebraTerm2.sum(...others), last);
		}
	}

	substitute(value, replacement) {
		const term1 = ((this.term1 instanceof AlgebraTerm2)
			? this.term1.substitute(value, replacement)
			: this.term1
		);
		const term2 = ((this.term2 instanceof AlgebraTerm2)
			? this.term2.substitute(value, replacement)
			: this.term2
		);
		return new AlgebraTerm2(
			this.operation,
			term1 === value ? replacement : term1,
			term2 === value ? replacement : term2,
		);
	}
}

testing.addUnit("AlgebraTerm2.toString()", {
	"returns the string representation of x + 1": () => {
		const term = new AlgebraTerm2("+", "x", 1);
		expect(term.toString()).toEqual("x + 1");
	},
	"returns the string representation of 2 * (x - 3)": () => {
		const term = new AlgebraTerm2("*", 2, new AlgebraTerm2("-", "x", 3));
		expect(term.toString()).toEqual("2 * (x - 3)");
	}
});
testing.addUnit("AlgebraTerm2.tokenize()", {
	"can tokenize an expression with single-letter variables": () => {
		const tokens = AlgebraTerm2.tokenize("x + y");
		expect(tokens).toEqual([
			{ token: "x", type: "variable" },
			{ token: "+", type: "operator" },
			{ token: "y", type: "variable" }
		]);
	},
	"can tokenize an expression with weird whitespace": () => {
		const tokens = AlgebraTerm2.tokenize("   x  +	  y ");
		expect(tokens).toEqual([
			{ token: "x", type: "variable" },
			{ token: "+", type: "operator" },
			{ token: "y", type: "variable" }
		]);
	},
	"can tokenize an expression with no whitespace": () => {
		const tokens = AlgebraTerm2.tokenize("x+y-z");
		expect(tokens).toEqual([
			{ token: "x", type: "variable" },
			{ token: "+", type: "operator" },
			{ token: "y", type: "variable" },
			{ token: "-", type: "operator" },
			{ token: "z", type: "variable" }
		]);
	},
	"can tokenize an expression with numbers": () => {
		const tokens = AlgebraTerm2.tokenize("1 + 2");
		expect(tokens).toEqual([
			{ token: "1", type: "number" },
			{ token: "+", type: "operator" },
			{ token: "2", type: "number" }
		]);
	},
	"can tokenize an expression with parentheses": () => {
		const tokens = AlgebraTerm2.tokenize("1 + (2 * (3 ^ 4))");
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
		const tokens = AlgebraTerm2.tokenize("1.2 + 3.4");
		expect(tokens).toEqual([
			{ token: "1.2", type: "number" },
			{ token: "+", type: "operator" },
			{ token: "3.4", type: "number" }
		]);
	},
	"can tokenize an expression with negative numbers": () => {
		const tokens = AlgebraTerm2.tokenize("1 + -2");
		expect(tokens).toEqual([
			{ token: "1", type: "number" },
			{ token: "+", type: "operator" },
			{ token: "-2", type: "number" }
		]);
	},
	"can tokenize an expression with multi-letter variable names containing numbers and underscores": () => {
		const tokens = AlgebraTerm2.tokenize("fOo123_4 - BAr_7_8__9");
		expect(tokens).toEqual([
			{ token: "fOo123_4", type: "variable" },
			{ token: "-", type: "operator" },
			{ token: "BAr_7_8__9", type: "variable" }
		]);
	}
});
testing.addUnit("AlgebraTerm2.parse()", {
	"can parse a simple expression": () => {
		const term = AlgebraTerm2.parse("x + 2");
		expect(term).toEqual(new AlgebraTerm2("+", "x", 2));
	},
	"can parse an expression with weird whitespace": () => {
		const term = AlgebraTerm2.parse("   x +    2       ");
		expect(term).toEqual(new AlgebraTerm2("+", "x", 2));
	},
	"can parse an expression with no whitespace": () => {
		const term = AlgebraTerm2.parse("x+2");
		expect(term).toEqual(new AlgebraTerm2("+", "x", 2));
	},
	"can parse an expression with parentheses": () => {
		const term = AlgebraTerm2.parse("(x + 1) * 2");
		expect(term).toEqual(
			new AlgebraTerm2("*",
				new AlgebraTerm2("+", "x", 1),
				2
			)
		);
	},
	"can parse an expression with redundant parentheses": () => {
		const term = AlgebraTerm2.parse("((((5)))) + ((x))");
		expect(term).toEqual(new AlgebraTerm2("+", 5, "x"));
	},
	"can parse an expression containing a non-integer": () => {
		const term = AlgebraTerm2.parse("1.23 * x");
		expect(term).toEqual(new AlgebraTerm2("*", 1.23, "x"));
	},
	"can parse an expression containing a negative number": () => {
		const term = AlgebraTerm2.parse("-123 * x");
		expect(term).toEqual(new AlgebraTerm2("*", -123, "x"));
	},
	"can parse an expression with a negative sign at the beginning of the string": () => {
		const term = AlgebraTerm2.parse("-x + 3");
		expect(term).toEqual(new AlgebraTerm2("+", new AlgebraTerm2("-", 0, "x"), 3));
	},
	"can parse an expression with a negative sign at the beginning of a parenthesized subexpression": () => {
		const term = AlgebraTerm2.parse("5 + (-x)");
		expect(term).toEqual(new AlgebraTerm2("+", 5, new AlgebraTerm2("-", 0, "x")));
	},
	"can parse an expression with a negative sign after another operator": () => {
		const term = AlgebraTerm2.parse("5 * -x");
		expect(term).toEqual(new AlgebraTerm2("*", 5, new AlgebraTerm2("-", 0, "x")));
	},
	"can parse an expression with a negative sign in front of parentheses": () => {
		const term = AlgebraTerm2.parse("5 * -(x)");
		expect(term).toEqual(new AlgebraTerm2("*", 5, new AlgebraTerm2("-", 0, "x")));
	},
	"can parse an expression with a multi-letter, multi-number variable name": () => {
		const term = AlgebraTerm2.parse("foo123 / 17");
		expect(term).toEqual(new AlgebraTerm2("/", "foo123", 17));
	},
	"can parse a multi-operator expression without parentheses": () => {
		const term = AlgebraTerm2.parse("y + 7 - 3");
		expect(term).toEqual(new AlgebraTerm2("-", new AlgebraTerm2("+", "y", 7), 3));
	},
	"can parse an expression with a single pair of parentheses": () => {
		const term = AlgebraTerm2.parse("2 * (x + 1)");
		expect(term).toEqual(new AlgebraTerm2("*", 2, new AlgebraTerm2("+", "x", 1)));
	},
	"correctly uses the order of operations when there are no parentheses": () => {
		const term = AlgebraTerm2.parse("x + y * z"); // x + (y * z), not (x + y) * z
		expect(term).toEqual(new AlgebraTerm2("+", "x", new AlgebraTerm2("*", "y", "z")));
	},
	"correctly uses the order of operations when there are equal-precedence operators - test case 1": () => {
		const term = AlgebraTerm2.parse("x + y - z");
		expect(term).toEqual(new AlgebraTerm2("-", new AlgebraTerm2("+", "x", "y"), "z"));
	},
	"correctly uses the order of operations when there are equal-precedence operators - test case 2": () => {
		const term = AlgebraTerm2.parse("x - y + z");
		expect(term).toEqual(new AlgebraTerm2("+", new AlgebraTerm2("-", "x", "y"), "z"));
	},
});
testing.addUnit("AlgebraTerm2.sum()", {
	"correctly returns the sum of a single term": () => {
		const term = new AlgebraTerm2("*", "x", 2);
		const sum = AlgebraTerm2.sum(term);
		expect(sum).toEqual(term);
	},
	"correctly returns the sum of two terms": () => {
		const term1 = new AlgebraTerm2("*", "x", 2);
		const term2 = new AlgebraTerm2("*", "x", 3);
		const sum = AlgebraTerm2.sum(term1, term2);
		expect(sum).toEqual(new AlgebraTerm2("+", term1, term2));
	},
	"correctly returns the sum of three terms": () => {
		const term1 = new AlgebraTerm2("*", "x", 2);
		const term2 = new AlgebraTerm2("*", "x", 3);
		const term3 = new AlgebraTerm2("*", "x", 4);
		const sum = AlgebraTerm2.sum(term1, term2, term3);
		expect(sum).toEqual(new AlgebraTerm2("+", new AlgebraTerm2("+", term1, term2), term3));
	}
});
testing.addUnit("AlgebraTerm2.substitute()", {
	"can replace a variable with another variable": () => {
		const term = new AlgebraTerm2("+", "x", 2); // x + 2
		const substituted = term.substitute("x", "y");
		expect(substituted.toString()).toEqual("y + 2");
	},
	"can replace a variable with another variable in a nested expression": () => {
		const term = new AlgebraTerm2("*", new AlgebraTerm2("+", "x", 2), 3); // (x + 2) * 3
		const substituted = term.substitute("x", "y");
		expect(substituted.toString()).toEqual("(y + 2) * 3");
	},
	"can replace a variable with a number": () => {
		const term = new AlgebraTerm2("/", "x", 2); // x/2
		const substituted = term.substitute("x", 3);
		expect(substituted.toString()).toEqual("3 / 2");
	},
	"can replace a variable with a number in a nested expression": () => {
		const term = new AlgebraTerm2("*", new AlgebraTerm2("+", "x", 2), 5); // (x + 2) * 5
		const substituted = term.substitute("x", 3);
		expect(substituted.toString()).toEqual("(3 + 2) * 5");
	},
	"can replace a variable with an expression": () => {
		const term = new AlgebraTerm2("*", "x", 5);
		const substituted = term.substitute("x", new AlgebraTerm2("+", "x", 2));
		expect(substituted.toString()).toEqual("(x + 2) * 5");
	},
	"can replace a variable with an expression in a nested expression": () => {
		const term = new AlgebraTerm2("*", new AlgebraTerm2("+", "x", 2), 5); // (x + 2) * 5
		const substituted = term.substitute("x", new AlgebraTerm2("/", "y", 3));
		expect(substituted.toString()).toEqual("((y / 3) + 2) * 5");
	}
});
testing.testUnit("AlgebraTerm2.parse()");
// testing.runTestByName("AlgebraTerm2.parse() - can parse a multi-operator expression without parentheses");
