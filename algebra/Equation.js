class Equation {
	constructor(leftSide, rightSide) {
		this.leftSide = leftSide;
		this.rightSide = rightSide;
	}

	toString() {
		return `${this.leftSide} = ${this.rightSide}`;
	}

	variables() {
		const variables1 = this.leftSide instanceof Expression ? this.leftSide.variables() : new Set();
		const variables2 = this.rightSide instanceof Expression ? this.rightSide.variables() : new Set();
		return variables1.union(variables2);
	}
}
