import { factorialExponents } from "./total-roundness-2.mjs";

export const factorialRoundness = (num: number, modulo: number = Infinity) => {
	const exponents = factorialExponents(num);
	let sum = 0;
	for(let i = 1; i <= exponents[0]; i ++) {
		let product = 1;
		for(const exponent of exponents) {
			const divisorExponent = Math.floor(exponent / i);
			if(divisorExponent === 0) { break; }
			product *= (divisorExponent + 1);
			product %= modulo;
		}
		sum += product - 1;
		sum %= modulo;
	}
	return sum % modulo;
};

// console.time();
// console.log(factorialRoundness(10000000, 10 ** 9 + 7));
// console.timeEnd();
// debugger;
