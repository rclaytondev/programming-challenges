import { MathUtils } from "../../utils-ts/modules/math/MathUtils.mjs";
import { Utils } from "../../utils-ts/modules/Utils.mjs";
import { FiniteCollection } from "../FiniteCollection.mjs";
import { FiniteGroup } from "../FiniteGroup.mjs";

export class CyclicGroup extends FiniteGroup<number> {
	size: number;
	constructor(size: number) {
		const elements = {
			[Symbol.iterator]: function*() {
				for(let i = 0; i < size; i ++) {
					yield i;
				}
			}
		};
		super(
			(a, b) => MathUtils.generalizedModulo(a + b, this.size),
			0,
			(a) => MathUtils.generalizedModulo(-a, this.size),
			new FiniteCollection(elements)
		);
		this.size = size;
	}
}
