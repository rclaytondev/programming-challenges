import { BigintMath } from "../../utils-ts/modules/math/BigintMath.mjs";
import { CountLogger } from "../project-specific-utilities/CountLogger.mjs";

const solve = (upperBound: number) => {
	const squares = new Set<bigint>();
	const logger = new CountLogger(n => 10000 * n, Math.sqrt(((upperBound + 2) / 6 + 1) * ((upperBound + 2) / 2 + 1)));
	for(let i = 1n; i ** 2n <= ((upperBound + 2) / 6 + 1) * ((upperBound + 2) / 2 + 1); i ++) {
		logger.count();
		squares.add(i ** 2n);
	}

	let sum = 0n;
	for(let k = 1n; 2n * k + 2n * (2n * k - 1n) <= upperBound; k ++) {
		const side1 = 2n * k;
		if(squares.has((k - 1n) * (3n * k - 1n))) {
			const perimeter = side1 + 2n * (side1 - 1n);
			sum += perimeter;
		}
		if(squares.has((k + 1n) * (3n * k + 1n))) {
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
