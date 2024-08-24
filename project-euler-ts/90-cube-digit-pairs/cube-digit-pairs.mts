import { MathUtils } from "../../utils-ts/modules/math/MathUtils.mjs";

export const subsetsOfSize = <T,>(items: T[], size: number): Set<T>[] => {
	if(size <= 0) { return size === 0 ? [new Set()] : []; }
	const result = [];
	for(const [firstIndex, firstItem] of items.slice(0, items.length - (size - 1)).entries()) {
		const after = items.slice(firstIndex + 1);
		for(const subset of subsetsOfSize(after, size - 1)) {
			result.push(new Set([firstItem, ...subset]));
		}
	}
	return result;
};

export const subsetsOfMaxSize = <T,>(items: T[], maxSize: number) => {
	let result: Set<T>[] = [];
	for(let size = 0; size <= maxSize; size ++) {
		result = [...result, ...subsetsOfSize(items, size)];
	}
	return result;
};

export const subsetsContaining = <T,>(items: T[], maxSize: number, requiredItems: T[]) => {
	const optionalItems = items.filter(v => !requiredItems.includes(v));
	const result = [];
	for(const set of subsetsOfMaxSize(optionalItems, maxSize - requiredItems.length)) {
		result.push(new Set([...requiredItems, ...set]));
	}
	return result;
};

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const REQUIRED_DIGITS = [0, 1, 2, 3, 4, 5, 8];
const FACES_ON_DIE = 6;
const SQUARE_DIGIT_PAIRS: [number, number][] = [
	[0, 1],
	[0, 4],
	[0, 9],
	...[4, 5, 6, 7, 8, 9].map(d => MathUtils.digits(d ** 2) as [number, number])
];

const includesWithRotation = (nums: number[], num: number) => {
	return nums.includes(num) || ((num === 6 || num === 9) && (nums.includes(6) || nums.includes(9)));
};
const canExpress = (die1: number[], die2: number[], pair: [number, number]) => {
	const [num1, num2] = pair;
	return (
		(includesWithRotation(die1, num1) && includesWithRotation(die2, num2)) ||
		(includesWithRotation(die2, num1) && includesWithRotation(die1, num2))
	);
};
const canExpressSquares = (die1: number[], die2: number[]) => {
	return SQUARE_DIGIT_PAIRS.every(pair => canExpress(die1, die2, pair));
};

const solve = () => {
	let total = 0;
	for(const set1 of subsetsOfMaxSize(DIGITS, FACES_ON_DIE)) {
		const numWays1 = MathUtils.binomial(FACES_ON_DIE - 1, set1.size - 1);
		const remainingRequired = REQUIRED_DIGITS.filter(d => !set1.has(d));
		for(const set2 of subsetsContaining(DIGITS, FACES_ON_DIE, remainingRequired)) {
			const numWays2 = MathUtils.binomial(FACES_ON_DIE - 1, set2.size - 1);
			if(canExpressSquares([...set1], [...set2])) {
				total += numWays1 * numWays2;
			}
		}
	}
	return total;
};

console.time();
console.log(solve());
console.timeEnd();
debugger;
