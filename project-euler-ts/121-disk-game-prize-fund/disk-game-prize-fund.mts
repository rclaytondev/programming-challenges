import { Rational } from "../../utils-ts/modules/math/Rational.mjs";

export const winProbability = (blueMinusRed: number, turnsPassed: number, totalTurns: number): Rational => {
	if(turnsPassed >= totalTurns) {
		return (blueMinusRed > 0) ? new Rational(1) : new Rational(0);
	}
	const blueProbability = winProbability(blueMinusRed + 1, turnsPassed + 1, totalTurns);
	const redProbability = winProbability(blueMinusRed - 1, turnsPassed + 1, totalTurns);
	return new Rational(1, turnsPassed + 2).multiply(blueProbability).add(new Rational(turnsPassed + 1, turnsPassed + 2).multiply(redProbability));
};

const result = winProbability(0, 0, 15);
debugger;
