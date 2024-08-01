import { BigintMath } from "../../utils-ts/modules/math/BigintMath.mjs";
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

export const rankPowerSum = (permutation: Permutation, m: number, modulo: bigint) => {
	let result = BigintMath.factorial(BigInt(m));
	for(const cycle of productCycles(permutation)) {
		if(cycle[0][0] === cycle[0][1]) { continue; }
		let startingPointSum = 0n;
		let cycleTotal = 0n;
		for(const [i, j] of cycle) {
			if(j < i) {
				startingPointSum = (startingPointSum + BigintMath.factorial(BigInt(permutation.values.length - j))) % modulo;
			}
			if(i < j) {
				cycleTotal ++;
			}
		}
		result = (result + startingPointSum * (BigintMath.factorial(BigInt(m)) / BigInt(cycle.length) * cycleTotal)) % modulo;
	}
	return result;
};
export const solve = (m: number, modulo: bigint) => {
	return rankPowerSum(permutations.pi(m), m, modulo);
};

console.time("solving the problem");
console.log(solve(100));
console.timeEnd("solving the problem");
