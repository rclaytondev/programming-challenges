import { Field } from "../../utils-ts/modules/math/Field.mjs";
import { MathUtils } from "../../utils-ts/modules/math/MathUtils.mjs";
import { Rational } from "../../utils-ts/modules/math/Rational.mjs";
import { Utils } from "../../utils-ts/modules/Utils.mjs";

const isProbable = (probabilities: Rational[], combination: Rational[]) => {
	const product = Field.RATIONALS.product(...combination);
	const oppositeProduct = Field.RATIONALS.product(...combination.map(p => new Rational(1).subtract(p)));
	return product.isGreaterThan(oppositeProduct) || (product.equals(oppositeProduct) && combination[0].equals(probabilities[0]));
};
const informationCombination = (p: Rational, q: Rational) => {
	/* 
	Returns the number r such that r/(1-r) = p/(1-p) * q/(1-q).
	Equivalently, it returns pq/(1 - p - q + 2pq).
	*/
	const denominator = new Rational(1).subtract(p).subtract(q).add(new Rational(2).multiply(p).multiply(q));
	return p.multiply(q).divide(denominator);
};

export const naiveProbabilitySum = (probabilities: Rational[], nextProbability: Rational) => {
	let result = new Rational(0, 1);
	for(const combination of [...Utils.cartesianProduct(
		...probabilities
		.filter(p => !p.equals(new Rational(1, 2)))
		.map((probability, i) => (i === 0) ? [probability] : [probability, new Rational(1).subtract(probability)])
	)]) {
		if(isProbable(probabilities, [...combination, nextProbability])) {
			result = result.add(Field.RATIONALS.product(...combination));
		}
		else {
			result = result.add(Field.RATIONALS.product(...combination.map(p => new Rational(1).subtract(p))));
		}
	}
	return result;
};

export const probabilitySum = (probabilities: Rational[], nextProbability: Rational): Rational => {
	if(probabilities.length === 1) {
		const [probability] = probabilities;
		return isProbable(probabilities, [probability, nextProbability]) ? probability : new Rational(1).subtract(probability);
	}

	const lastProbability = probabilities[probabilities.length - 1];
	const otherProbabilities = probabilities.slice(0, probabilities.length - 1);
	const sum1 = probabilitySum(otherProbabilities, informationCombination(lastProbability, nextProbability));
	const sum2 = probabilitySum(otherProbabilities, informationCombination(new Rational(1).subtract(lastProbability), nextProbability));
	return lastProbability.multiply(sum1).add((new Rational(1).subtract(lastProbability)).multiply(sum2));
};

export const solve = (probabilities: Rational[]) => {
	return probabilitySum(probabilities, new Rational(1, 2));
};

// console.log(solve([0.2, 0.4, 0.6, 0.8]));
// debugger;
