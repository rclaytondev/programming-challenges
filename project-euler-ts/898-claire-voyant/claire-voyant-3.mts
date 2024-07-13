import { Field } from "../../utils-ts/modules/math/Field.mjs";
import { Rational } from "../../utils-ts/modules/math/Rational.mjs";
import { Utils } from "../../utils-ts/modules/Utils.mjs";

export class DiscreteDistribution {
	private entriesMap: Map<string, Rational> = new Map();
	constructor(entries: Map<Rational, Rational> = new Map()) {
		for(const [key, value] of entries) {
			this.entriesMap.set(key.toString(), value);
		}
	}
	get(value: Rational) {
		return this.entriesMap.get(value.toString()) ?? new Rational(0);
	}
	set(value: Rational, probability: Rational) {
		this.entriesMap.set(value.toString(), probability);
	}
	*entries(): Generator<[Rational, Rational]> {
		for(const [valueString, probability] of this.entriesMap) {
			yield [Rational.parse(valueString), probability];
		}
	}
	size() {
		return this.entriesMap.size;
	}
}

export const getProductDistribution = (...distributions: DiscreteDistribution[]): DiscreteDistribution => {
	if(distributions.length === 1) {
		return distributions[0];
	}
	else if(distributions.length === 2) {
		const [dist1, dist2] = distributions;
		const result = new DiscreteDistribution();
		for(const [value1, probability1] of dist1.entries()) {
			for(const [value2, probability2] of dist2.entries()) {
				const previousProbability = result.get(value1.multiply(value2));
				const newProbability = previousProbability.add(probability1.multiply(probability2));
				result.set(value1.multiply(value2), newProbability);
			}
		}
		return result;
	}
	else {
		let result = distributions[0];
		for(const [index, distribution] of distributions.slice(1).entries()) {
			result = getProductDistribution(result, distribution);
			const numWithoutMerges = 2 ** (index + 2);
			const numMerged = numWithoutMerges - result.size();
			console.log(`done with ${index + 1}/${distributions.length - 1} steps; ${numMerged} of ${numWithoutMerges} states merged (${(numMerged / numWithoutMerges * 100).toFixed(1)}% total)`);
		}
		return result;
		// return distributions.reduce((a, b) => getProductDistribution(a, b));
	}
};

const getDistributions = (probabilities: Rational[]) => {
	probabilities = probabilities.filter(p => !p.equals(new Rational(1, 2)));
	probabilities = probabilities.map(p => p.isLessThan(new Rational(1, 2)) ? new Rational(1).subtract(p) : p);
	return probabilities.map(probability => new DiscreteDistribution(new Map([
		[probability.divide(new Rational(1).subtract(probability)), probability],
		[(new Rational(1).subtract(probability)).divide(probability), new Rational(1).subtract(probability)]
	])));
};
export const solve = (probabilities: Rational[]) => {
	const distributions = getDistributions(probabilities);
	const productDistribution = getProductDistribution(...distributions);
	const term1 = Field.RATIONALS.sum(...[...productDistribution.entries()]
		.filter(([value, probability]) => value.isGreaterThan(new Rational(1)))
		.map(([value, probability]) => probability)
	);
	const term2 = productDistribution.get(new Rational(1)).multiply(new Rational(1, 2));
	return term1.add(term2);
};
const THE_PROBLEM = Utils.range(25, 75, "inclusive", "inclusive").map(n => new Rational(n, 100));
console.log(solve(THE_PROBLEM));
