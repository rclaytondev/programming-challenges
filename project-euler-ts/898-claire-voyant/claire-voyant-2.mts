import { MathUtils } from "../../utils-ts/modules/math/MathUtils.mjs";
import { Utils } from "../../utils-ts/modules/Utils.mjs";

const isProbable = (probabilities: number[], combination: number[]) => {
	const product = MathUtils.product(combination);
	const oppositeProduct = MathUtils.product(combination.map(p => 1 - p));
	return product > oppositeProduct || (product === oppositeProduct && combination[0] === probabilities[0]);
};

export const naiveProbabilitySum = (probabilities: number[], nextProbability: number) => {
	let result = 0;
	for(const combination of [...Utils.cartesianProduct(
		...probabilities
		.filter(p => p !== 0.5)
		.map((probability, i) => (i === 0) ? [probability] : [probability, 1 - probability])
	)]) {
		if(isProbable(probabilities, [...combination, nextProbability])) {
			result += MathUtils.product(combination);
		}
		else {
			result += MathUtils.product(combination.map(p => 1 - p));
		}
	}
	return result;
};

export const probabilitySum = (probabilities: number[], nextProbability: number): number => {
	if(probabilities.length === 1) {
		const [probability] = probabilities;
		return (probability * nextProbability) >= (1 - probability) * (1 - nextProbability) ? probability : 1 - probability;
	}

	const lastProbability = probabilities[probabilities.length - 1];
	const otherProbabilities = probabilities.slice(0, probabilities.length - 1);
	const sum1 = probabilitySum(otherProbabilities, (lastProbability * nextProbability) / (1 - lastProbability - nextProbability + 2 * lastProbability * nextProbability));
	const sum2 = probabilitySum(otherProbabilities, (1 - lastProbability) * nextProbability / (lastProbability + nextProbability - 2 * lastProbability * nextProbability));
	return lastProbability * sum1 + (1 - lastProbability) * sum2;
};

export const solve = (probabilities: number[]) => {
	return probabilitySum(probabilities, 1/2);
};

// console.log(solve([0.2, 0.4, 0.6, 0.8]));
// debugger;
