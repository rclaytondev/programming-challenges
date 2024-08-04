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

let matchsticksList = [0, 2];

const updateMatchsticksList = () => {
	const num = matchsticksList.length;
	const sumRepresentations = Utils.range(1, num - 1).map(k => matchsticksList[k] + matchsticksList[num - k] + 2);
	const nextValue = Math.min(productMatchsticks(num), ...sumRepresentations);
	matchsticksList.push(nextValue);
};

const solve = (num: number) => {
	while(matchsticksList.length <= num) {
		updateMatchsticksList();
	}
	return MathUtils.sum(matchsticksList.slice(0, num + 1));
};

console.time();
console.log(solve(10000));
console.timeEnd();
debugger;
