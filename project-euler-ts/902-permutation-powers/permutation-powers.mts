import { BigintMath } from "../../utils-ts/modules/math/BigintMath.mjs";
import { MathUtils } from "../../utils-ts/modules/math/MathUtils.mjs";
import { Utils } from "../../utils-ts/modules/Utils.mjs";

export class Permutation {
	readonly values: number[];
	private applyPowerResults: Map<string, number> = new Map();
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
	applyPower(power: number, input: number): number {
		if(power === 1) {
			return this.values[input - 1];
		}
		const stringified = `${power},${input}`;
		if(this.applyPowerResults.has(stringified)) {
			return this.applyPowerResults.get(stringified)!;
		}
		const result = this.values[this.applyPower(power - 1, input) - 1];
		this.applyPowerResults.set(stringified, result);
		return result;
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

export const rankPowerSum = (m: number,  modulo = BigInt(10 ** 9 + 7)) => {
	const permutation = permutations.pi(Number(m));
	const n = m * (m + 1) / 2;
	let result = BigintMath.factorial(BigInt(m));
	for(let j = 1; j <= n; j ++) {
		for(let i = j + 1; i <= n; i ++) {
			const period = MathUtils.lcm(permutation.cycleLength(i), permutation.cycleLength(j));
			let count = 0;
			for(let k = 1; k <= period; k ++) {
				if(permutation.applyPower(k, i) < permutation.applyPower(k, j)) {
					count ++;
				}
			}
			if(BigintMath.factorial(BigInt(m)) % BigInt(period) !== 0n) {
				throw new Error(`Period length did not divide m!, which means you need to rewrite the algorithm with extra code to handle this case.`);
			}
			result += (BigintMath.factorial(BigInt(n - j)) * BigInt(count) * BigintMath.factorial(BigInt(m)) / BigInt(period)) % modulo;
			result %= modulo;
		}
	}
	return result;
};
