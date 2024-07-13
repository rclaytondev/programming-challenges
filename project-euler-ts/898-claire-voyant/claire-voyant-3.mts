import { Field } from "../../utils-ts/modules/math/Field.mjs";
import { BigRational } from "../../utils-ts/modules/math/BigRational.mjs";
import { Utils } from "../../utils-ts/modules/Utils.mjs";

const getMax = (rationals: BigRational[]) => {
	let max = rationals[0];
	for(const rational of rationals.slice(1)) {
		if(rational.isGreaterThan(max)) {
			max = rational;
		}
	}
	return max;
};

export class DiscreteDistribution {
	private entriesMap: Map<string, BigRational> = new Map();
	constructor(entries: Map<BigRational, BigRational> = new Map()) {
		for(const [key, value] of entries) {
			this.entriesMap.set(key.toString(), value);
		}
	}
	get(value: BigRational) {
		return this.entriesMap.get(value.toString()) ?? new BigRational(0);
	}
	set(value: BigRational, probability: BigRational) {
		this.entriesMap.set(value.toString(), probability);
	}
	delete(value: BigRational) {
		this.entriesMap.delete(value.toString());
	}
	*entries(): Generator<[BigRational, BigRational]> {
		for(const [valueString, probability] of this.entriesMap) {
			yield [BigRational.parse(valueString), probability];
		}
	}
	size() {
		return this.entriesMap.size;
	}
	values() {
		return [...this.entriesMap.keys()].map(k => BigRational.parse(k));
	}
}

export const getProductDistribution = (...distributions: DiscreteDistribution[]): [DiscreteDistribution, BigRational] => {
	if(distributions.length === 1) {
		return [distributions[0], new BigRational(0)];
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
		return [result, new BigRational(0)];
	}
	else {
		let extraTotalAbove = new BigRational(0);
		let result = distributions[0];
		for(const [index, distribution] of distributions.slice(1).entries()) {
			[result] = getProductDistribution(result, distribution);
			const remaining = distributions.slice(index + 2);
			const maximumChange = Field.BIG_RATIONALS.product(...remaining.map(d => getMax(d.values())));
			for(const [value, probability] of result.entries()) {
				if(value.isGreaterThan(maximumChange)) {
					// console.log(`deleted a value and added it to the total!`);
					result.delete(value);
					extraTotalAbove = extraTotalAbove.add(probability);
				}
				else if(value.isLessThan(maximumChange.inverse())) {
					// console.log(`deleted a value!`);
					result.delete(value);
				}
			}
			const numWithoutPruning = 2 ** (index + 2);
			const numMerged = numWithoutPruning - result.size();
			console.log(`done with ${index + 1}/${distributions.length - 1} steps; ${numMerged} of ${numWithoutPruning} states pruned (${(numMerged / numWithoutPruning * 100).toFixed(1)}% total)`);
		}
		return [result, extraTotalAbove];
		// return distributions.reduce((a, b) => getProductDistribution(a, b));
	}
};

const getDistributions = (probabilities: BigRational[]) => {
	return probabilities.map(probability => new DiscreteDistribution(new Map([
		[probability.divide(new BigRational(1).subtract(probability)), probability],
		[(new BigRational(1).subtract(probability)).divide(probability), new BigRational(1).subtract(probability)]
	])));
};
export const solve = (probabilities: BigRational[]) => {
	probabilities = probabilities.filter(p => !p.equals(new BigRational(1, 2)));
	probabilities = probabilities.map(p => p.isLessThan(new BigRational(1, 2)) ? new BigRational(1).subtract(p) : p);
	probabilities = probabilities.sort((a, b) => Number(b.compare(a)));
	const distributions = getDistributions(probabilities);
	const [productDistribution, extraTotalAbove] = getProductDistribution(...distributions);
	const term1 = Field.BIG_RATIONALS.sum(...[...productDistribution.entries()]
		.filter(([value, probability]) => value.isGreaterThan(new BigRational(1)))
		.map(([value, probability]) => probability)
	);
	const term2 = productDistribution.get(new BigRational(1)).multiply(new BigRational(1, 2));
	return extraTotalAbove.add(term1).add(term2);
};
const THE_PROBLEM = Utils.range(25, 75, "inclusive", "inclusive").map(n => new BigRational(n, 100));
console.log(solve(THE_PROBLEM));
