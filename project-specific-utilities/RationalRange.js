class RationalRange {
	constructor(min, max) {
		if(!(min instanceof Rational) || !(max instanceof Rational)) {
			throw new Error(`Invalid input; min and max must be Rationals.`);
		}
		this.min = min;
		this.max = max;
	}

	intersection(range) {
		const newMin = Rational.max(this.min, range.min);
		const newMax = Rational.min(this.max, range.max);
		return new RationalRange(newMin, newMax);
	}

	toString() {
		return `${this.min.toString("pretty")} - ${this.max.toString("pretty")}`;
	}
}
