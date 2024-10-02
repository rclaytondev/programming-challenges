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


export const numSquarefree = (upperBound: number) => {
	const primes = [...Sequence.PRIMES.termsBelow(Math.sqrt(upperBound))];
	const notSquarefree = sizeOfUnion(
		primes.map(p => p ** 2),
		n => Math.floor(upperBound / n),
		(a, b) => a * b
	);
	return (upperBound - 1) - notSquarefree;
};

console.time();
console.log(numSquarefree(10 ** 9));
console.timeEnd();
debugger;
