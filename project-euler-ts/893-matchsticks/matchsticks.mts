import { MathUtils } from "../../utils-ts/modules/math/MathUtils.mjs";
import { Utils } from "../../utils-ts/modules/Utils.mjs";

const DIGIT_MATCHSTICKS = [6, 2, 5, 5, 4, 5, 6, 3, 7, 6];

const digits = (num: number): number[] => {
	if(num < 10) { return [num]; }
	return [...digits(Math.floor(num / 10)), num % 10];
};

const matchsticksForDigits = (num: number) => MathUtils.sum(digits(num).map(d => DIGIT_MATCHSTICKS[d]));

const productMatchsticks = Utils.memoize((num: number): number => {
	const productRepresentations = MathUtils.divisors(num)
		.filter(d => d !== 1 && d !== num)
		.map(d => productMatchsticks(d) + productMatchsticks(num / d) + 2);
	return Math.min(matchsticksForDigits(num), ...productRepresentations);
});

const matchsticks = Utils.memoize((num: number): number => {
	if(num <= 1) { return matchsticksForDigits(num); }
	const sumRepresentations = Utils.range(1, num - 1).map(k => matchsticks(k) + matchsticks(num - k) + 2);
	return Math.min(productMatchsticks(num), ...sumRepresentations);
});

const solve = (num: number) => {
	return MathUtils.sum(Utils.range(1, num).map(n => matchsticks(n)));
};

console.time();
console.log(solve(10000));
console.timeEnd();
debugger;
