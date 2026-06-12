import { RationalDistribution } from "./RationalDistribution.mjs";

export class Problem205 {
	static solve(numCubes: number = 6, numTetrahedra: number = 9) {
		const cubicDie = RationalDistribution.uniform([1, 2, 3, 4, 5, 6]);
		const tetrahedralDie = RationalDistribution.uniform([1, 2, 3, 4]);

		const cubicDice = RationalDistribution.convolution(...Array(numCubes).fill(cubicDie));
		const tetrahedralDice = RationalDistribution.convolution(...Array(numTetrahedra).fill(tetrahedralDie));

		const differenceDistribution = RationalDistribution.convolution(tetrahedralDice, cubicDice.map(value => -value));
		return differenceDistribution.probability(value => value > 0);
	}
}

// console.time();
// console.log(Problem205.solve());
// console.timeEnd();
// debugger;
