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
	intersects(range) {
		return this.min.compareTo(range.max) < 0 && this.max.compareTo(range.min) > 0;
	}

	toString() {
		return `${this.min.toString("pretty")} - ${this.max.toString("pretty")}`;
	}
}
