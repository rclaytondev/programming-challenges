import { BigintMath } from "../../utils-ts/modules/math/BigintMath.mjs";
import { MathUtils } from "../../utils-ts/modules/math/MathUtils.mjs";
import { Utils } from "../../utils-ts/modules/Utils.mjs";

export class Permutation {
	values: number[];
	constructor(values: number[]) {
		this.values = values;
	}
	static fromFunction(size: number, func: (n: number) => number) {
		const values = [];
		for(let i = 1; i <= size; i ++) {
			values[i - 1] = func(i);
		}
		return new Permutation(values);
	}

	rank() {
		let result = 1;
		for(const [index, value] of this.values.entries()) {
			const remaining = this.values.slice(index);
			result += MathUtils.factorial(remaining.length - 1) * remaining.filter(n => n < value).length;
		}
		return result;
	}

	static compose(p1: Permutation, p2: Permutation) {
		const values = [];
		for(const [index, value] of p2.values.entries()) {
			values[index] = p1.values[value - 1];
		}
		return new Permutation(values);
	}
	inverse() {
		const values = [];
		for(const [index, value] of this.values.entries()) {
			values[value - 1] = index + 1;
		}
		return new Permutation(values);
	}

	*powers(maxPower: number | bigint) {
		let power: Permutation = this;
		for(let i = 0; i < maxPower; i ++) {
			yield power;
			power = Permutation.compose(power, this);
		}
	}
	cycleLength(input: number) {
		let length = 0;
		let value = input;
		do {
			value = this.values[value - 1];
			length ++;
		} while(value !== input);
		return length;
	}
}

const permutations = {
	sigma: (m: number) => Permutation.fromFunction(m * (m + 1) / 2, (i: number) => {
		const k = Utils.range(1, m).find(k => k * (k + 1) / 2 === i);
		return (k != null) ? k * (k - 1) / 2 + 1 : i + 1;
	}),
	tau: (n: number) => Permutation.fromFunction(n, i => (((10 ** 9 + 7) * i) % n) + 1),
	pi: (m: number) => {
		const sigma = permutations.sigma(m);
		const tau = permutations.tau(m * (m + 1) / 2);
		return Permutation.compose(tau.inverse(), Permutation.compose(sigma, tau));
	}
};

export const naiveRankPowerSum = (m: number) => {
	const permutation = permutations.pi(m);
	let power = permutation;
	let result = 0;
	for(let k = 1; k <= MathUtils.factorial(m); k ++) {
		result += power.rank();
		power = Permutation.compose(power, permutation);
	}
	return result;
};

export const rankPowerSum = (m: number) => {
	const permutation = permutations.pi(Number(m));
	const powers = [...permutation.powers(MathUtils.factorial(m))];
	const n = m * (m + 1) / 2;
	let result = MathUtils.factorial(m);
	for(let k = 1; k <= MathUtils.factorial(m); k ++) {
		for(let j = 1; j <= n; j ++) {
			for(let i = j + 1; i <= n; i ++) {
				if(powers[k-1].values[i-1] < powers[k-1].values[j-1]) {
					result += MathUtils.factorial(n - j);
				}
			}
		}
	}
	return result;
};
