import { factorialExponents } from "./total-roundness-2.mjs";

export const factorialRoundness = (num: number, modulo: number = Infinity) => {
	const exponents = factorialExponents(num);
	let sum = 0;
	for(let i = 1; i <= exponents[0]; i ++) {
		const divisorExponents = exponents.map(e => Math.floor(e / i));
		sum += divisorExponents.map(d => d + 1).reduce((a, b) => a * b % modulo, 1) - 1;
	}
	return sum;
};

console.time();
console.log(factorialRoundness(20000, 10 ** 9 + 7));
console.timeEnd();
debugger;
