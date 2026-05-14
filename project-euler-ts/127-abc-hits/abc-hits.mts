import { Factorization } from "../../utils-ts/modules/math/Factorization.mjs";
import { MathUtils } from "../../utils-ts/modules/math/MathUtils.mjs";
import { Utils } from "../../utils-ts/modules/Utils.mjs";
import { CountLogger } from "../project-specific-utilities/CountLogger.mjs";

const factors = Utils.memoize(MathUtils.factors);

const isABCHit = (a: number, b: number, c: number) => {
	const pairwiseCoprime = (
		MathUtils.gcd(a, b) === 1 &&
		MathUtils.gcd(b, c) === 1 &&
		MathUtils.gcd(a, c) === 1
	);
	const radical = MathUtils.product(new Set([...factors(a),...factors(b),...factors(c)]));
	return (
		pairwiseCoprime
		&& a < b
		&& a + b === c
		&& radical < c
	);
};

export const naiveABCHits = (c: number) => {
	let hits = 0;
	for(let a = 1; a < c / 2; a ++) {
		if(isABCHit(a, c - a, c)) {
			hits ++;
		}
	}
	return hits;
};

const getNextPrime = (num: number) => {
	for(let i = num + 1; true; i ++) {
		if(MathUtils.isPrime(i)) { return i; }
	}
};

export const abcHits = (cFactorization: Factorization, aFactorization: Factorization = Factorization.ONE, c: number = cFactorization.toNumber(), a: number = aFactorization.toNumber(), previousPrime: number = -Infinity, currentPrime: number = 2) => {
	if(a >= c / 2) { return 0; }

	const radA = MathUtils.product(aFactorization.factors());
	const radC = MathUtils.product(cFactorization.factors());
	if(radA * radC >= c) { return 0; }
	const radB = MathUtils.product(factors(c - a));
	
	let hits = 0;
	if(
		(previousPrime === -Infinity || aFactorization.exponents.has(previousPrime))
		&& radA * radB * radC < c
	) {
		hits ++;
	}
	if(a * currentPrime >= c / 2) {
		return hits;
	}
	
	const nextPrime = getNextPrime(currentPrime);
	for(let exponent = 0; a * currentPrime ** exponent < c / 2; exponent ++) {
		if(exponent === 1 && c % currentPrime === 0) { break; }
		const nextA = aFactorization.multiply(Factorization.fromPrimePower(currentPrime, exponent));
		hits += abcHits(cFactorization, nextA, c, a * (currentPrime ** exponent), currentPrime, nextPrime);
	}
	return hits;
};

export const abcHitSum = (maxC: number) => {
	const logger = new CountLogger(n => 100 * n, maxC);
	let sum = 0;
	for(let c = 3; c < maxC; c ++) {
		logger.count();
		sum += c * abcHits(Factorization.fromNumber(c));
	}
	return sum;
};

// console.time();
// console.log(abcHitSum(2500));
// console.timeEnd();
// debugger;
