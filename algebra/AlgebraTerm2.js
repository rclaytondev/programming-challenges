class AlgebraParseError extends Error {}
class AlgebraTerm2 {
	constructor(operation, term1, term2) {
		this.operation = operation;
		this.term1 = term1;
		this.term2 = term2;
	}

	static parse(string) {
		if(string.includes("(")) {

		}
		// debugger;
		// string = string.trim().replace(/);
		const ORDER_OF_OPERATIONS = [
			["^"],
			["*", "/"],
			["+", "-"]
		];

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
	}
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
	"can substitute a variable for another variable": () => {

	}
});
