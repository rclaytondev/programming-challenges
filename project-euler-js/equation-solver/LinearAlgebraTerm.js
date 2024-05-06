/* represents an algebraic term consisting of a constant value or a variable multplied by a constant. */

class LinearAlgebraTerm {
	constructor() {
		if(typeof arguments[0] === "number") {
			const [coefficient, variableName] = arguments;
			this.variableName = variableName ?? null;
			this.coefficient = coefficient;
		}
		else if(typeof arguments[0] === "string") {
			const [variableName] = arguments;
			this.variableName = variableName;
			this.coefficient = 1;
		}
		else if(arguments[0] instanceof Expression) {
			const [term] = arguments;
			expect(term.operation).toEqual("*");
			const coefficient = [term.term1, term.term2].find(v => typeof v === "number");
			const variableName = [term.term1, term.term2].find(v => typeof v === "string");
			expect(coefficient).toNotEqual(undefined);
			expect(variableName).toNotEqual(undefined);
			this.coefficient = coefficient;
			this.variableName = variableName;
		}
	}
	static parse(string) {
		if(/\d/g.test(string)) {
			if(/[a-zA-Z]/g.test(string)) {
				/* string should be a number followed by a variable name */
				const PARSER = /^(-?\d+(?:\.\d+)?)([a-zA-Z])$/;
				if(!PARSER.test(string)) { throw new Error("Incorrectly-formatted LinearExpression string."); }
				const [, coefficient, variableName] = PARSER.exec(string);
				return new LinearAlgebraTerm(Number.parseFloat(coefficient), variableName);
			}
			else {
				/* string should be a number */
				return new LinearAlgebraTerm(Number.parseFloat(string), null);
			}
		}
		else {
			/* string should be a single letter, possibly with a minus sign in front. */
			testing.assert(/^-?[a-zA-Z]$/.test(string));
			if(string.startsWith("-")) {
				return new LinearAlgebraTerm(-1, string[1]);
			}
			else {
				return new LinearAlgebraTerm(1, string);
			}
		}
	}

	toString() {
		if(this.variableName == null) { return `${this.coefficient}`; }
		if(this.coefficient == 0) { return "0"; }
		if(this.coefficient == 1) { return this.variableName; }
		if(this.coefficient == -1) { return `-${this.variableName}`; }
		return `${this.coefficient}${this.variableName}`;
	}
}
testing.addUnit("LinearAlgebraTerm.parse()", LinearAlgebraTerm.parse, [
	["123x", new LinearAlgebraTerm(123, "x")],
	["-456y", new LinearAlgebraTerm(-456, "y")],
	["3.14a", new LinearAlgebraTerm(3.14, "a")],
	["-7.89b", new LinearAlgebraTerm(-7.89, "b")],

	["a", new LinearAlgebraTerm(1, "a")],
	["-a", new LinearAlgebraTerm(-1, "a")],

	["123", new LinearAlgebraTerm(123, null)],
	["-123", new LinearAlgebraTerm(-123, null)],
	["3.797", new LinearAlgebraTerm(3.797, null)],
	["-3.797", new LinearAlgebraTerm(-3.797, null)]
]);
testing.addUnit("LinearAlgebraTerm.toString()", [
	(term) => term.toString(),
	[new LinearAlgebraTerm(123, "x"), "123x"],
	[new LinearAlgebraTerm(-123, "x"), "-123x"],
	[new LinearAlgebraTerm(1.23, "y"), "1.23y"],
	[new LinearAlgebraTerm(-1.23, "y"), "-1.23y"],

	[new LinearAlgebraTerm(123, null), "123"],
	[new LinearAlgebraTerm(1, "a"), "a"],
	[new LinearAlgebraTerm(-1, "a"), "-a"],
	[new LinearAlgebraTerm(0, "a"), "0"],
]);
