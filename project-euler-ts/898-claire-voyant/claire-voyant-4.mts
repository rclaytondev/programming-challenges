import { BigRational } from "../../utils-ts/modules/math/BigRational.mjs";
import { Field } from "../../utils-ts/modules/math/Field.mjs";
import { Utils } from "../../utils-ts/modules/Utils.mjs";

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
export const getProductDistribution = (...distributions: DiscreteDistribution[]) => {
	const [dist1, dist2] = distributions;
	const result = new DiscreteDistribution();
	for(const [value1, probability1] of dist1.entries()) {
		for(const [value2, probability2] of dist2.entries()) {
			const product = value1.multiply(value2);
			const previousProbability = result.get(product);
			const newProbability = previousProbability.add(probability1.multiply(probability2, false));
			result.set(product, newProbability);
		}
	}
	return result;
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
			result.add(value1.divide(value2), probability1.multiply(probability2, false));
		}
	}
	return result;
};
const getFinalDistributions = (votingDistributions: DiscreteDistribution[]): [DiscreteDistribution, DiscreteDistribution, BigRational] => {
	let stateDistribution = new DiscreteDistribution(new Map([[new BigRational(1), new BigRational(1)]]));
	let rayDistribution = new DiscreteDistribution(new Map([[new BigRational(1), new BigRational(1)]]));
	let extraTotalAbove = new BigRational(0);
	let forwardIndex = 0;
	let backwardIndex = votingDistributions.length;

	while(backwardIndex > forwardIndex) {
		stateDistribution = getProductDistribution(stateDistribution, votingDistributions[forwardIndex]);
		forwardIndex ++;
		const remaining = votingDistributions.slice(forwardIndex);
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
		console.log("-----------------------------");
		console.log(`finished forward iteration ${forwardIndex}`);

		const numWithoutPruning = 2 ** forwardIndex;
		const numMerged = numWithoutPruning - stateDistribution.size();
		console.log(`${numMerged} of ${numWithoutPruning} states pruned (${(numMerged / numWithoutPruning * 100).toFixed(1)}% total)`);
		
		if(backwardIndex === forwardIndex) { break; }

		backwardIndex --;
		rayDistribution = getNextRayOrPointDistribution(rayDistribution, votingDistributions[backwardIndex]);
		console.log(`finished backward iteration ${backwardIndex}`);
		const numWithoutPruning2 = 2 ** (votingDistributions.length - backwardIndex);
		const numMerged2 = numWithoutPruning2 - rayDistribution.size();
		console.log(`${numMerged2} of ${numWithoutPruning2} rays pruned (${(numMerged2 / numWithoutPruning2 * 100).toFixed(1)}% total)`);
	}
	return [stateDistribution, rayDistribution, extraTotalAbove];
};
export const weightedSum = (stateDistribution: DiscreteDistribution, rayDistribution: DiscreteDistribution) => {
	let result = new BigRational(0);
	const sortedStateValues = stateDistribution.values().sort((a, b) => Number(b.compare(a)));
	const sortedRayValues = (rayDistribution
		.values()
		.filter(v => sortedStateValues.length === 0 || v.isLessThan(sortedStateValues[0]))
		.sort((a, b) => Number(b.compare(a)))
	);
	let total = new BigRational(0);
	let rayIndex = 0;
	for(const [index, value] of sortedStateValues.entries()) {
		const nextValue: BigRational | null = sortedStateValues[index + 1] ?? null;
		total = total.add(stateDistribution.get(value));
		while(
			(rayIndex < sortedRayValues.length && value.isGreaterThan(sortedRayValues[rayIndex])) &&
			(nextValue == null || !nextValue.isGreaterThan(sortedRayValues[rayIndex]))
		) {
			result = result.add(total.multiply(rayDistribution.get(sortedRayValues[rayIndex])));
			rayIndex ++;
		}
	}
	for(const [point, weight] of rayDistribution.entries()) {
		result = result.add(stateDistribution.get(point).multiply(weight, false).divide(new BigRational(2), false));
	}
	return result;
};
export const naiveWeightedSum = (stateDistribution: DiscreteDistribution, rayDistribution: DiscreteDistribution) => {
	let result = new BigRational(0);
	for(const [rayStartPoint, rayWeight] of rayDistribution.entries()) {
		for(const [value, probability] of stateDistribution.entries()) {
			if(value.isGreaterThan(rayStartPoint)) {
				result = result.add(probability.multiply(rayWeight));
			}
		}
	}
	for(const [point, pointWeight] of rayDistribution.entries()) {
		for(const [value, probability] of stateDistribution.entries()) {
			if(value.equals(point)) {
				result = result.add(probability.multiply(pointWeight).multiply(new BigRational(1, 2)));
			}
		}
	}
	return result;
};
export const solve = (probabilities: BigRational[]) => {
	probabilities = probabilities.filter(p => !p.equals(new BigRational(1, 2)));
	probabilities = probabilities.map(p => p.isLessThan(new BigRational(1, 2)) ? new BigRational(1).subtract(p) : p);
	probabilities = probabilities.sort((a, b) => Number(b.compare(a)));
	const votingDistributions = getVotingDistributions(probabilities);
	let [stateDistribution, rayDistribution, result] = getFinalDistributions(votingDistributions);
	return result.add(weightedSum(stateDistribution, rayDistribution));
};

console.time();
const THE_PROBLEM = Utils.range(25, 75, "inclusive", "inclusive").map(n => new BigRational(n, 100));
console.log(solve(THE_PROBLEM));
console.timeEnd();
