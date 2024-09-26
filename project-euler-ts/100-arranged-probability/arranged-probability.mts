import { BigintMath } from "../../utils-ts/modules/math/BigintMath.mjs";
import { CountLogger } from "../project-specific-utilities/CountLogger.mjs";

const logger = new CountLogger(n => 100000 * n);

export const nextSolution = (minDisks: bigint) => {
	let largestSqrt = BigintMath.floorSqrt(1n + 2n * (minDisks ** 2n - minDisks));
	for(let disks = minDisks + 1n; true; disks ++) {
		logger.count();
		const discriminant = 1n + 2n * (disks ** 2n - disks);
		while(largestSqrt ** 2n < discriminant) {
			largestSqrt ++;
		}
		if(largestSqrt ** 2n === discriminant) {
			return (1n + BigintMath.floorSqrt(discriminant)) / 2n;
		}
	}
};

console.log(nextSolution(10n ** 12n));
debugger;
