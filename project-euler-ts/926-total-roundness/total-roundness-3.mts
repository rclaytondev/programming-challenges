import { MathUtils } from "../../utils-ts/modules/math/MathUtils.mjs";
import { factorialExponents } from "./total-roundness-2.mjs";

export const factorialRoundness = (num: number) => {
	const exponents = factorialExponents(num);
	let sum = 0;
	for(let i = 1; i <= exponents[0]; i ++) {
		const divisorExponents = exponents.map(e => Math.floor(e / i));
		sum += MathUtils.product(divisorExponents.map(d => d + 1)) - 1;
	}
	return sum;
};

console.time();
console.log(factorialRoundness(20000));
console.timeEnd();
debugger;
