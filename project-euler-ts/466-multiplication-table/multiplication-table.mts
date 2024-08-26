import { BigintMath } from "../../utils-ts/modules/math/BigintMath.mjs";
import { Utils } from "../../utils-ts/modules/Utils.mjs";
import { CountLogger } from "../project-specific-utilities/CountLogger.mjs";

export class Range {
	min: bigint;
	max: bigint;
	constructor(min: bigint, max: bigint) {
		this.min = min;
		this.max = max;
	}
}

const sieve = (divisors: bigint[]) => {
	for(let i = 0; i < divisors.length; i ++) {
		divisors = divisors.filter(d => d === divisors[i] || d % divisors[i] !== 0n);
	}
	return divisors;
};
const checkSubset = (range: Range, set: bigint[], remaining: bigint[], lcm: bigint): bigint => {
	if(lcm > range.max) { return 0n; }
	if(set.length !== 0 && remaining.length === 0) {
		return multiplesInRange([lcm], range) * (set.length % 2 === 0 ? -1n : 1n);
	}
	if(remaining.length > 0) {
		const [next, ...others] = remaining;
		return checkSubset(range, set, others, lcm) + checkSubset(range, [...set, next], others, BigintMath.lcm(lcm, next));
	}
	return 0n;
};
export const multiplesInRange = (divisors: bigint[], range: Range) => {
	if(divisors.length === 1) {
		const [divisor] = divisors;
		const lowestMultiple = BigintMath.divideCeil(range.min, BigInt(divisor));
		const highestMultiple = range.max / BigInt(divisor);
		return highestMultiple - lowestMultiple + 1n;
	}


	divisors = sieve(divisors);
	return checkSubset(range, [], divisors, 1n);
};

export const termsInTable = (width: bigint, height: bigint) => {
	[width, height] = [BigintMath.max(width, height), BigintMath.min(width, height)];
	const logger = new CountLogger(n => n, Number(height), "outer loop");
	let result = 0n;
	for(let i = 1n; i <= height; i ++) {
		logger.count();
		result += multiplesInRange(Utils.range(Number(i), Number(height)).map(BigInt), new Range(width * (i - 1n) + 1n, width * i));
	}
	return result;
};

// console.time();
// console.log(termsInTable(64n, 10n ** 16n));
// console.timeEnd();
// debugger;
