import { Field } from "../../utils-ts/modules/math/Field.mjs";
import { MathUtils } from "../../utils-ts/modules/math/MathUtils.mjs";
import { Matrix } from "../../utils-ts/modules/math/Matrix.mjs";

const MODULO = 1000000007;
const ZMod2Z = Field.integersModulo(2);

const getMovesMatrix = (numCoins: number, flipsPerMove: number) => {
	const movesMatrix = new Matrix(numCoins, numCoins, ZMod2Z);
	for(let startPosition = 0; startPosition < numCoins; startPosition ++) {
		for(let coinPosition = 0; coinPosition < flipsPerMove; coinPosition ++) {
			movesMatrix.set((startPosition + coinPosition) % numCoins, startPosition, 1);
		}
	}
	return movesMatrix;
};
export const numSolvableStates = (numCoins: number, flipsPerMove: number, modulo: number = MODULO) => {
	if(MathUtils.gcd(flipsPerMove, numCoins) === 1) {
		return MathUtils.modularExponentiate(2, flipsPerMove % 2 === 0 ? numCoins - 1 : numCoins, modulo);
	}
	
	const movesMatrix = getMovesMatrix(numCoins, flipsPerMove);
	const rank = movesMatrix.rank();
	return MathUtils.modularExponentiate(2, rank, modulo);
};
export const solve = (upperBound: number, modulo: number = MODULO) => {
	let result = 0;
	for(let numCoins = 1; numCoins <= upperBound; numCoins ++) {
		for(let flipsPerMove = 1; flipsPerMove <= numCoins; flipsPerMove ++) {
			result += numSolvableStates(numCoins, flipsPerMove, modulo);
			result %= modulo;
		}
		console.log(`calculated F(${numCoins}, k) for all k <= ${numCoins}`);
	}
	return result;
};
