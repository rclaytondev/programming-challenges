import { Sequence } from "../../utils-ts/modules/math/Sequence.mjs";

export const sizeOfUnion = <T,>(sets: Iterable<T>, getSize: (set: T) => number, getIntersection: (set1: T, set2: T) => T): number => {
	const nonemptySets = [...sets].filter(s => getSize(s) !== 0);
	if(nonemptySets.length === 0) {
		return 0;
	}
	else if(nonemptySets.length === 1) {
		return getSize(nonemptySets[0]);
	}

	let total = 0;
	for(const [i, first] of nonemptySets.entries()) {
		const others = nonemptySets.slice(i + 1);
		total += getSize(first);
		total -= sizeOfUnion(others.map(s => getIntersection(first, s)), getSize, getIntersection);
	}
	return total;
};

const numDivisible = (divisors: number[], upperBound: number) => {
	if(divisors.length === 1) {
		return Math.floor(upperBound / divisors[0]);
	}

	let total = 0;
	for(const [i, first] of divisors.entries()) {
		const others = divisors.slice(i + 1);
		total += Math.floor(upperBound / first);
		const newDivisors = others.map(d => d * first).filter(d => d <= upperBound);
		if(newDivisors.length === 0 && upperBound < first) { break; }
		total -= numDivisible(newDivisors, upperBound);
	}
	return total;
};


export const numSquarefree = (upperBound: number) => {
	const primes = [...Sequence.PRIMES.termsBelow(Math.sqrt(upperBound))];
	const notSquarefree = numDivisible(primes.map(p => p ** 2), upperBound);
	return (upperBound - 1) - notSquarefree;
};

console.time();
console.log(numSquarefree(10 ** 9));
console.timeEnd();
debugger;
