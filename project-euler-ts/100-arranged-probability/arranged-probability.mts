import { BigintMath } from "../../utils-ts/modules/math/BigintMath.mjs";

export const nextSolution = (minDisks: bigint) => {
	for(let disks = minDisks + 1n; true; disks ++) {
		const discriminant = 1n + 2n * (disks ** 2n - disks);
		if(BigintMath.isSquare(discriminant)) {
			return (1n + BigintMath.floorSqrt(discriminant)) / 2n;
		}
	}
};

console.log(nextSolution(10n ** 12n));
debugger;
