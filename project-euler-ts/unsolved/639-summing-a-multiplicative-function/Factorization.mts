import { MapUtils } from "../../../utils-ts/modules/core-extensions/MapUtils.mjs";

export class Factorization {
	readonly exponents: Map<number, number> = new Map();
	constructor(exponents: Map<number, number>) {
		this.exponents = MapUtils.filter(exponents, (p, e) => e !== 0);
	}

	static ONE = new Factorization(new Map());
}
