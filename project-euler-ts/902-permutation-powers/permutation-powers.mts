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
}
