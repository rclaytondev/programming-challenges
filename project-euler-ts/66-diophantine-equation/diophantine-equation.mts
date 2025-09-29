import { BigintMath } from "../../utils-ts/modules/math/BigintMath.mjs";

const minSolution = (D: number) => {
	for(let y = 1n; true; y ++) {
		const x = BigintMath.floorSqrt(1n + BigInt(D) * y ** 2n);
		if(x ** 2n === 1n + BigInt(D) * y ** 2n) {
			console.log(`for D=${D}, the minimal solution has x=${x}`);
			return Number(x);
		}
	}
};

export const solve = () => {
	let highestD = 0;
	let highestMinSolution = -Infinity;
	for(let D = 1; D <= 1000; D ++) {
		if(Math.sqrt(D) % 1 === 0) { continue; }
		const solution =  minSolution(D);
		// console.log(`For D=${D}, the minimal solution has x=${solution}`);
		if(solution > highestMinSolution) {
			highestMinSolution = solution;
			highestD = D;
		}
	}
	return highestD;
};
console.time();
console.log(solve());
console.timeEnd();
debugger;
