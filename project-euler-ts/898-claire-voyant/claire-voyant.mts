import { MathUtils } from "../../utils-ts/modules/math/MathUtils.mjs";
import { GenUtils } from "../../utils-ts/modules/core-extensions/GenUtils.mjs";

export const solve = (lyingProbabilities: number[]) => {
	debugger;
	return MathUtils.sum([...GenUtils.cartesianProduct(
		...lyingProbabilities
		.filter(p => p !== 0.5)
		.map((probability, i) => (i === 0) ? [probability] : [probability, 1 - probability])
	)].map(combination => Math.max(
		MathUtils.product(combination),
		MathUtils.product(combination.map(p => 1 - p))
	)));
};

// console.log(solve([0.6, 0.8]));

// console.log(solve([0.2, 0.4, 0.6, 0.8]));
// console.log(solve([0.2, 0.4, solve([0.6, 0.8])]));
// console.log(solve([0.2, 0.4, 0.8]));
// console.log(solve([0.2, 0.4]));

// console.log(solve([0.75]));
// console.log(solve([0.75, 0.25]));

// console.log(solve([0.2, solve([0.4, solve([0.6, 0.8])])]));debugger;
// debugger;
