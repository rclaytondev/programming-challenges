import { BigRational } from "../../utils-ts/modules/math/BigRational.mjs";

export const winProbability = (blueMinusRed: number, turnsPassed: number, totalTurns: number): BigRational => {
	if(turnsPassed >= totalTurns) {
		return (blueMinusRed > 0) ? new BigRational(1) : new BigRational(0);
	}
	const blueProbability = winProbability(blueMinusRed + 1, turnsPassed + 1, totalTurns);
	const redProbability = winProbability(blueMinusRed - 1, turnsPassed + 1, totalTurns);
	return new BigRational(1, turnsPassed + 2).multiply(blueProbability).add(new BigRational(turnsPassed + 1, turnsPassed + 2).multiply(redProbability));
};

// const result = winProbability(0, 0, 15);
// console.log(result.inverse().toNumber());
// console.log(result.denominator / result.numerator);
// debugger;
