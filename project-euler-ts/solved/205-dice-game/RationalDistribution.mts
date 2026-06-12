import { MapUtils } from "../../../utils-ts/modules/core-extensions/MapUtils.mjs";
import { Rational } from "../../../utils-ts/modules/math/Rational.mjs";

export class RationalDistribution {
	readonly probabilities: ReadonlyMap<number, Rational>;

	constructor(probabilities: ReadonlyMap<number, Rational>) {
		this.probabilities = probabilities;
	}

	isValid() {
		const totalProbability = [...this.probabilities.values()].reduce((sum, p) => sum.add(p), new Rational(0));
		return totalProbability.equals(new Rational(1));
	}

	static uniform(values: number[]) {
		const probability = new Rational(1, values.length);
		const probabilities = new Map(values.map(value => [value, probability]));
		return new RationalDistribution(probabilities);
	}
	static convolution(...distributions: RationalDistribution[]): RationalDistribution {
		if(distributions.length === 0) {
			throw new Error("At least one distribution is required");
		}
		else if(distributions.length === 1) {
			return distributions[0];
		}
		else if(distributions.length === 2) {
			const probabilities = new Map<number, Rational>();
			for(const [value1, prob1] of distributions[0].probabilities) {
				for(const [value2, prob2] of distributions[1].probabilities) {
					const newValue = value1 + value2;
					const newProb = prob1.multiply(prob2);
					probabilities.set(newValue, (probabilities.get(newValue) ?? new Rational(0)).add(newProb));
				}
			}
			return new RationalDistribution(probabilities);
		}
		else {
			return distributions.reduce((acc, dist) => RationalDistribution.convolution(acc, dist));
		}
	}

	map(func: (value: number) => number) {
		const probabilities = new Map<number, Rational>();
		for(const [value, prob] of this.probabilities) {
			const newValue = func(value);
			probabilities.set(newValue, (probabilities.get(newValue) ?? new Rational(0)).add(prob));
		}
		return new RationalDistribution(probabilities);
	}
	probability(event: (value: number) => boolean) {
		const probabilities = MapUtils.filter(this.probabilities, event).values();
		return Rational.sum(probabilities);
	}
}
