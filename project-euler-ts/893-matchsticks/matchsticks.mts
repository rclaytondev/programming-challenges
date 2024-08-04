import { MathUtils } from "../../utils-ts/modules/math/MathUtils.mjs";
import { Utils } from "../../utils-ts/modules/Utils.mjs";

const DIGIT_MATCHSTICKS = [6, 2, 5, 5, 4, 5, 6, 3, 7, 6];

const digits = (num: number): number[] => {
	if(num < 10) { return [num]; }
	return [...digits(Math.floor(num / 10)), num % 10];
};

const matchsticksForDigits = (num: number) => MathUtils.sum(digits(num).map(d => DIGIT_MATCHSTICKS[d]));

const productMatchsticks = Utils.memoize((num: number): number => {
	const productRepresentations = MathUtils.properDivisors(num).map(d => productMatchsticks(d) + productMatchsticks(num / d) + 2);
	return Math.min(matchsticksForDigits(num), ...productRepresentations);
});

let matchsticksList = [0, 2];

const updateMatchsticksList = () => {
	const num = matchsticksList.length;
	let min = Infinity;
	for(let i = 1; 2 * i <= num; i ++) {
		min = Math.min(min, matchsticksList[i] + matchsticksList[num - i] + 2);
	}
	matchsticksList.push(Math.min(min, productMatchsticks(num)));
};

const solve = (num: number) => {
	let sum = 0;
	while(matchsticksList.length <= num + 1) {
		sum += matchsticksList[matchsticksList.length - 1];
		updateMatchsticksList();
	}
	return sum;
};

console.time();
console.log(solve(10000));
console.timeEnd();
debugger;
