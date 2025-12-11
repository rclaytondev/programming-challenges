import { MathUtils } from "../../utils-ts/modules/math/MathUtils.mjs";
import { PeriodicSet } from "../project-specific-utilities/PeriodicSet.mjs";

export const naiveSqrtsOf1 = (upperBound: number) => {
	const sqrtsOf1 = new Map<number, PeriodicSet>();
	for(let modulo = 2; modulo <= upperBound; modulo ++) {
		sqrtsOf1.set(modulo, PeriodicSet.fromIncludes(modulo, n => (n ** 2) % modulo === 1));
	}
	return sqrtsOf1;
};

export const getSqrtsOf1 = (upperBound: number) => {
	const sqrtsOf1 = new Map<number, PeriodicSet>();
	for(let modulo = 2; modulo <= upperBound; modulo ++) {
		const factorization = MathUtils.factorize(modulo);
		if(factorization.size === 1) {
			const [[prime, exponent]] = factorization.entries();
			const isSqrtOf1 = (n: number) => (n ** 2) % modulo === 1;
			if(exponent === 1) {
				sqrtsOf1.set(modulo, new PeriodicSet(modulo, [1, modulo - 1]));
			}
			else {
				const sqrts = sqrtsOf1.get(modulo / prime)!;
				sqrtsOf1.set(modulo, new PeriodicSet(modulo, sqrts.termsBelow(modulo).filter(isSqrtOf1)));
			}
		}
		else {
			sqrtsOf1.set(modulo,
				[...factorization.entries()]
				.map(([prime, exponent]) => sqrtsOf1.get(prime ** exponent)!)
				.reduce((a, b) => a.intersection(b))
			);
		}
	}
	return sqrtsOf1;
};

const solve = (upperBound: number) => {
	const sqrtsOf1 = getSqrtsOf1(upperBound);
	let sum = 0;
	for(let i = 3; i <= upperBound; i ++) {
		const largest = sqrtsOf1.get(i)!.offsets.findLast(n => n < i-1 && MathUtils.gcd(n, upperBound) === 1)!;
		sum += largest;
	}
	return sum;
};

console.time();
console.log(solve(10 ** 5));
console.timeEnd();
debugger;
