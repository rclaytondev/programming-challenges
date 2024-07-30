import { MathUtils } from "../../utils-ts/modules/math/MathUtils.mjs";
import { cycleOf, Permutation, permutations } from "./permutation-powers.mjs";


export const productCycles = function*(permutation: Permutation) {
	const cycles = [...permutation.cycles()];
	for(const cycle1 of cycles) {
		for(const cycle2 of cycles) {
			const period = MathUtils.lcm(cycle1.length, cycle2.length);
			for(const startValue of cycle2.slice(0, cycle1.length * cycle2.length / period)) {
				yield cycleOf(
					([x, y]) => [permutation.values[x-1], permutation.values[y-1]] as [number, number],
					[cycle1[0], startValue] as [number, number]
				);
			}
		}
	}
};

export const rankPowerSum = (permutation: Permutation, m: number) => {
	let result = MathUtils.factorial(m);
	for(const cycle of productCycles(permutation)) {
		if(cycle[0][0] === cycle[0][1]) { continue; }
		let startingPointSum = 0;
		let cycleTotal = 0;
		for(const [i, j] of cycle) {
			if(j < i) {
				startingPointSum += MathUtils.factorial(permutation.values.length - j);
			}
			if(i < j) {
				cycleTotal ++;
			}
		}
		result += startingPointSum * (MathUtils.factorial(m) / cycle.length * cycleTotal);
	}
	return result;
};
export const solve = (m: number) => {
	return rankPowerSum(permutations.pi(m), m);
};
