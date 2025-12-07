import { ArrayUtils } from "../../utils-ts/modules/core-extensions/ArrayUtils.mjs";
import { BigintMath } from "../../utils-ts/modules/math/BigintMath.mjs";

export class Range {
	min: bigint;
	max: bigint;
	constructor(min: bigint, max: bigint) {
		this.min = min;
		this.max = max;
	}

	toString() {
		return `[${this.min} .. ${this.max}]`;
	}
}

const sieve = (divisors: bigint[]) => {
	for(let i = 0; i < divisors.length; i ++) {
		divisors = divisors.filter(d => d === divisors[i] || d % divisors[i] !== 0n);
	}
	return divisors;
};
const cachedResults = new Map<string, bigint>();
const checkSubset = (range: Range, remaining: bigint[], lcm: bigint): bigint => {
	const argsString = [range, remaining, lcm].join(", ");
	const cachedResult = cachedResults.get(argsString);
	if(typeof cachedResult === "bigint") {
		return cachedResult;
	}
	if(lcm > range.max) { return 0n; }
	if(lcm !== 1n && remaining.length === 0) {
		const result = -multiplesInRange([lcm], range);;
		cachedResults.set(argsString, result);
		return result;
	}
	if(remaining.length > 0) {
		const [next, ...others] = remaining;
		const result = (
			checkSubset(range, others, lcm)
			- checkSubset(range, others, BigintMath.lcm(lcm, next))
		);
		cachedResults.set(argsString, result);
		return result;
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
	if(divisors.includes(1n)) {
		return range.max - range.min + 1n;
	}


	divisors = sieve(divisors);
	return checkSubset(range, divisors, 1n);
};

export const termsInTable = (width: bigint, height: bigint) => {
	[width, height] = [BigintMath.max(width, height), BigintMath.min(width, height)];
	// const logger = new CountLogger(n => n, Number(height), "outer loop");
	let result = 0n;
	for(let i = 1n; i <= height; i ++) {
		cachedResults.clear();
		// logger.count();
		result += multiplesInRange(ArrayUtils.range(Number(i), Number(height)).map(BigInt), new Range(width * (i - 1n) + 1n, width * i));
	}
	return result;
};

// console.time();
// console.log(termsInTable(64n, 10n ** 16n));
// console.timeEnd();
// debugger;
