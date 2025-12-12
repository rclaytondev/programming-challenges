import { ArrayUtils } from "../../utils-ts/modules/core-extensions/ArrayUtils.mjs";
import { MathUtils } from "../../utils-ts/modules/math/MathUtils.mjs";
import { CountLogger } from "../project-specific-utilities/CountLogger.mjs";
import { PeriodicSet } from "../project-specific-utilities/PeriodicSet.mjs";

export const naiveSqrtsOf1 = (upperBound: number) => {
	const sqrtsOf1 = new Map<number, PeriodicSet>();
	for(let modulo = 2; modulo <= upperBound; modulo ++) {
		sqrtsOf1.set(modulo, PeriodicSet.fromIncludes(modulo, n => (n ** 2) % modulo === 1));
	}
	return sqrtsOf1;
};

export const modularRoots = (
	upperBound: number,
	polynomial: (x: number) => number,
	solutionsForPrimes?: (prime: number) => number[]
) => {
	const solutions = [
		new PeriodicSet(1, [1]),
		new PeriodicSet(1, [1])
	];
	const logger = new CountLogger(n => 10000 * n, upperBound);
	for(let modulo = 2; modulo <= upperBound; modulo ++) {
		logger.countTo(modulo);
		const factorization = MathUtils.factorize(modulo);
		if(factorization.size === 1) {
			const [[prime, exponent]] = factorization.entries();
			const isSolution = (n: number) => MathUtils.generalizedModulo(polynomial(n), modulo) === 0;
			if(exponent === 1) {
				solutions.push(new PeriodicSet(
					modulo,
					solutionsForPrimes?.(prime) ?? ArrayUtils.range(1, prime).filter(isSolution))
				);
			}
			else {
				const sqrts = solutions[modulo / prime];
				solutions.push(new PeriodicSet(modulo, sqrts.termsBelow(modulo).filter(isSolution)));
			}
		}
		else {
			solutions.push(
				[...factorization.entries()]
				.map(([prime, exponent]) => solutions[prime ** exponent])
				.reduce((a, b) => a.intersection(b))
			);
		}
	}
	return solutions;
};

export const getSqrtsOf1 = (upperBound: number) => modularRoots(
	upperBound,
	x => x ** 2 - 1,
	p => [1, p - 1]
);

const solve = (upperBound: number) => {
	const sqrtsOf1 = getSqrtsOf1(upperBound);
	let sum = 0;
	for(let i = 3; i <= upperBound; i ++) {
		const largest = sqrtsOf1[i].offsets.findLast(n => n < i-1 && MathUtils.gcd(n, i) === 1)!;
		sum += largest;
	}
	return sum;
};

// console.time();
// console.log(solve(2 * 10 ** 7));
// console.timeEnd();
// debugger;
