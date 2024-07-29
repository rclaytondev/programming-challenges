import { MathUtils } from "../../utils-ts/modules/math/MathUtils.mjs";

export class Permutation {
	values: number[];
	constructor(values: number[]) {
		this.values = values;
	}

	rank() {
		let result = 1;
		for(const [index, value] of this.values.entries()) {
			const remaining = this.values.slice(index);
			result += MathUtils.factorial(remaining.length - 1) * remaining.filter(n => n < value).length;
		}
		return result;
	}

	static compose(p1: Permutation, p2: Permutation) {
		const values = [];
		for(const [index, value] of p2.values.entries()) {
			values[index] = p1.values[value - 1];
		}
		return new Permutation(values);
	}
	inverse() {
		const values = [];
		for(const [index, value] of this.values.entries()) {
			values[value - 1] = index + 1;
		}
		return new Permutation(values);
	}
}
