import { BigintMath } from "../../utils-ts/modules/math/BigintMath.mjs";
import { CountLogger } from "../project-specific-utilities/CountLogger.mjs";

const solve = (upperBound: number) => {
	const logger = new CountLogger(n => 10000 * n, upperBound);
	let sum = 0n;
	for(let k = 1n; 2n * k + 2n * (2n * k - 1n) <= upperBound; k ++) {
		const side1 = 2n * k;
		logger.count();
		if(BigintMath.isSquare((k - 1n) * (3n * k - 1n))) {
			const perimeter = side1 + 2n * (side1 - 1n);
			sum += perimeter;
		}
		if(BigintMath.isSquare((k + 1n) * (3n * k + 1n))) {
			const perimeter = side1 + 2n * (side1 + 1n);
			if(perimeter <= upperBound) {
				sum += perimeter;
			}
		}
	}
	return sum;
};
console.log(solve(1000000000));
debugger;
