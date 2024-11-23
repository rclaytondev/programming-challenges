import { MathUtils } from "../../utils-ts/modules/math/MathUtils.mjs";
import { Utils } from "../../utils-ts/modules/Utils.mjs";
import { FiniteCollection } from "../FiniteCollection.mjs";
import { FiniteGroup } from "../FiniteGroup.mjs";

export class CyclicGroup extends FiniteGroup<number> {
	size: number;
	constructor(size: number) {
		super(
			(a, b) => MathUtils.generalizedModulo(a + b, this.size),
			0,
			(a) => MathUtils.generalizedModulo(-a, this.size),
			FiniteCollection.fromGenerator(function*() {
				for(let i = 0; i < size; i ++) {
					yield i;
				}
			})
		);
		this.size = size;
	}
}
