import { BigRational } from "../../utils-ts/modules/math/BigRational.mjs";
import { Field } from "../../utils-ts/modules/math/Field.mjs";

/* 
Idea behind the algorithm:
- Since each student decides to tell the truth or lie, we can think of it as a voting process, in which each student either votes for truth or lie, and students with a higher truth-telling probability have a higher voting power.
- This can be modelled as a (biased) 1D random walk, and we want to know the probability P that the random walk ends up to the right of where it started.
- We also need to know the probability Q that the random walk ends up exactly where it started; then the final answer is P + (Q/2).
- This is calculated by brute-forcing the tree of all combinations, with some clever optimizations.
*/

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
	add(value: BigRational, probabilityToAdd: BigRational) {
		const currentProbability = this.get(value);
		this.set(value, currentProbability.add(probabilityToAdd));
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

const getMax = (rationals: BigRational[]) => {
	let max = rationals[0];
	for(const rational of rationals.slice(1)) {
		if(rational.isGreaterThan(max)) {
			max = rational;
		}
	}
	return max;
};
export const getProductDistribution = (...distributions: DiscreteDistribution[]): [DiscreteDistribution, BigRational] => {
	const [dist1, dist2] = distributions;
	const result = new DiscreteDistribution();
	for(const [value1, probability1] of dist1.entries()) {
		for(const [value2, probability2] of dist2.entries()) {
			const product = value1.multiply(value2);
			const previousProbability = result.get(product);
			const newProbability = previousProbability.add(probability1.multiply(probability2));
			result.set(product, newProbability);
		}
	}
	return [result, new BigRational(0)];
};

const getVotingDistributions = (probabilities: BigRational[]) => {
	return probabilities.map(probability => new DiscreteDistribution(new Map([
		[probability.divide(new BigRational(1).subtract(probability)), probability],
		[(new BigRational(1).subtract(probability)).divide(probability), new BigRational(1).subtract(probability)]
	])));
};
const getNextRayOrPointDistribution = (distribution: DiscreteDistribution, votingDistribution: DiscreteDistribution) => {
	const result = new DiscreteDistribution();
	for(const [value1, probability1] of distribution.entries()) {
		for(const [value2, probability2] of votingDistribution.entries()) {
			result.add(value1.subtract(value2), probability1.multiply(probability2));
		}
	}
	return result;
};
const getFinalDistributions = (votingDistributions: DiscreteDistribution[]): [DiscreteDistribution, DiscreteDistribution, DiscreteDistribution, BigRational] => {
	let stateDistribution = votingDistributions[0];
	let rayDistribution = new DiscreteDistribution(new Map([[new BigRational(1), new BigRational(1)]]));
	let pointDistribution = new DiscreteDistribution(new Map([[new BigRational(1), new BigRational(1)]]));
	let extraTotalAbove = new BigRational(0);
	let forwardIndex = 0;
	let backwardIndex = votingDistributions.length - 1;

	while(backwardIndex > forwardIndex) {
		[stateDistribution] = getProductDistribution(stateDistribution, votingDistributions[forwardIndex]);
		forwardIndex ++;
		const remaining = votingDistributions.slice(forwardIndex + 1);
		const maximumChange = Field.BIG_RATIONALS.product(...remaining.map(d => getMax(d.values())));
		for(const [value, probability] of stateDistribution.entries()) {
			if(value.isGreaterThan(maximumChange)) {
				stateDistribution.delete(value);
				extraTotalAbove = extraTotalAbove.add(probability);
			}
			else if(value.isLessThan(maximumChange.inverse())) {
				stateDistribution.delete(value);
			}
		}

		if(backwardIndex === forwardIndex) { break; }

		rayDistribution = getNextRayOrPointDistribution(rayDistribution, votingDistributions[backwardIndex]);
		pointDistribution = getNextRayOrPointDistribution(pointDistribution, votingDistributions[backwardIndex]);
		backwardIndex --;
	}
	return [stateDistribution, rayDistribution, pointDistribution, extraTotalAbove];
};
export const solve = (probabilities: BigRational[]) => {
	const votingDistributions = getVotingDistributions(probabilities);
	let [stateDistribution, rayDistribution, pointDistribution, result] = getFinalDistributions(votingDistributions);
	const sortedStateValues = stateDistribution.values().sort((a, b) => Number(a.compare(b)));
	const sortedPointValues = pointDistribution.values().sort((a, b) => Number(a.compare(b)));
	const sortedRayValues = rayDistribution.values().sort((a, b) => Number(a.compare(b)));
	let total = new BigRational(0);
	let pointIndex = 0;
	let rayIndex = 0;
	for(const value of sortedStateValues) {
		total = total.add(value);
		while(rayIndex < sortedRayValues.length && value.isGreaterThan(sortedRayValues[rayIndex])) {
			result = result.add(total);
			rayIndex ++;
		}
		if(pointIndex < sortedPointValues.length && value.isGreaterThanOrEqualTo(sortedPointValues[pointIndex])) {
			if(value.equals(sortedPointValues[pointIndex])) {
				result = result.add(value.multiply(new BigRational(1, 2)));
			}
			pointIndex ++;
		}
	}
	return result;
};
