/* represents an algebraic term consisting of a constant value or a variable multplied by a constant. */

class AlgebraTerm {
	constructor(coefficient, variableName) {
		this.coefficient = coefficient;
		this.variableName = variableName;
	}
	static parse(string) {
		if(/\d/g.test(string)) {
			if(/[a-zA-Z]/g.test(string)) {
				/* string should be a number followed by a variable name */
				const PARSER = /^(-?\d+(?:\.\d+)?)([a-zA-Z])$/;
				if(!PARSER.test(string)) { throw new Error("Incorrectly-formatted expression string."); }
				const [, coefficient, variableName] = PARSER.exec(string);
				return new AlgebraTerm(Number.parseFloat(coefficient), variableName);
			}
			else {
				/* string should be a number */
				return new AlgebraTerm(Number.parseFloat(string), null);
			}
		}
		else {
			/* string should be a single letter, possibly with a minus sign in front. */
			testing.assert(/^-?[a-zA-Z]$/.test(string));
			if(string.startsWith("-")) {
				return new AlgebraTerm(-1, string[1]);
			}
			else {
				return new AlgebraTerm(1, string);
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
testing.addUnit("AlgebraTerm.parse()", AlgebraTerm.parse, [
	["123x", new AlgebraTerm(123, "x")],
	["-456y", new AlgebraTerm(-456, "y")],
	["3.14a", new AlgebraTerm(3.14, "a")],
	["-7.89b", new AlgebraTerm(-7.89, "b")],

	["a", new AlgebraTerm(1, "a")],
	["-a", new AlgebraTerm(-1, "a")],

	["123", new AlgebraTerm(123, null)],
	["-123", new AlgebraTerm(-123, null)],
	["3.797", new AlgebraTerm(3.797, null)],
	["-3.797", new AlgebraTerm(-3.797, null)]
]);
testing.addUnit("AlgebraTerm.toString()", [
	(term) => term.toString(),
	[new AlgebraTerm(123, "x"), "123x"],
	[new AlgebraTerm(-123, "x"), "-123x"],
	[new AlgebraTerm(1.23, "y"), "1.23y"],
	[new AlgebraTerm(-1.23, "y"), "-1.23y"],

	[new AlgebraTerm(123, null), "123"],
	[new AlgebraTerm(1, "a"), "a"],
	[new AlgebraTerm(-1, "a"), "-a"],
	[new AlgebraTerm(0, "a"), "0"],
]);
