import { MathUtils } from "../../utils-ts/modules/math/MathUtils.mjs";
import { cycleOf, Permutation, permutations } from "./permutation-powers.mjs";


export const productCycles = function*(permutation: Permutation) {
	const cycles = [...permutation.cycles()];
	for(const cycle1 of cycles) {
		for(const cycle2 of cycles) {
			const period = MathUtils.lcm(cycle1.length, cycle2.length);
			for(const startValue of cycle2.slice(0, cycle1.length * cycle2.length / period)) {
				yield cycleOf(
					([x, y]) => [permutation.values[x-1], permutation.values[y-1]],
					[cycle1[0], startValue]
				);
			}
		}
	}
};

