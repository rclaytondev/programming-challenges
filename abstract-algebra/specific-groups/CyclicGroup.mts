import { MathUtils } from "../../utils-ts/modules/math/MathUtils.mjs";
import { Utils } from "../../utils-ts/modules/Utils.mjs";
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
			elements,
			(a, b) => MathUtils.generalizedModulo(a + b, this.size),
			0,
			(a) => MathUtils.generalizedModulo(-a, this.size),
			(a) => a % 1 === 0 && 0 <= a && a < size
		);
		this.size = size;
	}
}
