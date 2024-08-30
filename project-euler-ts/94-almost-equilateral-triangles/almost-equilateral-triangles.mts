import { BigintMath } from "../../utils-ts/modules/math/BigintMath.mjs";
import { CountLogger } from "../project-specific-utilities/CountLogger.mjs";

const solve = (upperBound: number) => {
	// const logger = new CountLogger(n => 10000 * n, upperBound);
	let sum = 0n;
	for(let side1 = 1; side1 + 2 * (side1 - 1) <= upperBound; side1 ++) {
		// logger.count();
		for(const side2 of [side1 - 1, side1 + 1]) {
			const perimeter = side1 + 2 * side2;
			if(side2 === 0 || perimeter > upperBound) { continue; }
			const value = BigInt(side1) ** 2n * (4n * BigInt(side2) ** 2n - BigInt(side1) ** 2n);
			if(value % 16n === 0n && BigintMath.isSquare(value / 16n)) {
				sum += BigInt(perimeter);
			}
		}
	}
	return sum;
};
console.log(solve(1000000000));
debugger;
